import { DecodeError, SchemaError } from './error'
abstract class ObiBase {
  abstract encode(value: any): Buffer
  abstract decode(buff: Buffer): any[]
}

export class ObiInteger extends ObiBase {
  static REGEX = /^(u|i)(8|16|32|64|128|256)$/
  isSigned: boolean
  sizeInBytes: number

  constructor(schema: string) {
    super()
    this.isSigned = schema[0] === 'i'
    this.sizeInBytes = parseInt(schema.slice(1)) / 8
  }

  encode(value: bigint): Buffer {
    let newValue = BigInt(value)
    return Buffer.from(
      [...Array(this.sizeInBytes)]
        .map(() => {
          const dataByte = newValue % BigInt(1 << 8)
          newValue /= BigInt(1 << 8)
          return Number(dataByte)
        })
        .reverse(),
    )
  }

  decode(buff: Buffer): any {
    let value = BigInt(0)
    let multiplier = BigInt(1)
    for (let i = 0; i < this.sizeInBytes; i++) {
      value += BigInt(buff.readUInt8(this.sizeInBytes - i - 1)) * multiplier
      multiplier *= BigInt(1 << 8)
    }
    return [value, buff.slice(this.sizeInBytes)]
  }
}

export class ObiBool extends ObiBase {
  static REGEX = /^bool$/

  encode(value: boolean): Buffer {
    return new ObiInteger('u8').encode(value ? BigInt(1) : BigInt(0))
  }

  decode(buff: Buffer): any {
    let [u8, remaining] = new ObiInteger('u8').decode(buff)

    if (u8 === BigInt(1)) return [true, remaining]
    else if (u8 === BigInt(0)) return [false, remaining]
    else throw new DecodeError(`Boolean value must be 1 or 0 but got ${u8}`)
  }
}

export class ObiVector extends ObiBase {
  static REGEX = /^\[.*\]$/
  internalObi: any

  constructor(schema: string) {
    super()
    this.internalObi = ObiSpec.fromSpec(schema.slice(1, -1))
  }

  encode(value: any): Buffer {
    return Buffer.concat([
      new ObiInteger('u32').encode(value.length),
      ...value.map((item: any) => this.internalObi.encode(item)),
    ])
  }

  decode(buff: Buffer): any[] {
    let [length, remaining] = new ObiInteger('u32').decode(buff)
    let value = []
    for (let i = 0; i < Number(length); i++) {
      const decodeInternalResult = this.internalObi.decode(remaining)
      value.push(decodeInternalResult[0])
      remaining = decodeInternalResult[1]
    }
    return [value, remaining]
  }
}

export class ObiStruct extends ObiBase {
  static REGEX = /^{.*}$/
  internalObiKvs: any

  constructor(schema: string) {
    super()
    this.internalObiKvs = []

    let curlyCount = 0
    let kv: any[] = ['', ''],
      fill = 0 // 0 = k, 1 = v
    for (let c of schema.slice(1)) {
      if (c == '{') curlyCount++
      else if (curlyCount && c == '}') curlyCount--
      else if (!curlyCount && c === ':') {
        fill = 1
        continue
      } else if (!curlyCount && (c === ',' || c === '}')) {
        kv[1] = ObiSpec.fromSpec(kv[1])
        this.internalObiKvs.push(kv)
        kv = ['', '']
        fill = 0
        continue
      }

      kv[fill] += c
    }
  }

  encode(value: any): Buffer {
    return Buffer.concat(
      this.internalObiKvs.map(([k, obi]: any) => obi.encode(value[k])),
    )
  }

  decode(buff: Buffer): any {
    let value: any = {}
    let remaining = buff
    for (let [k, obi] of this.internalObiKvs) {
      const decodeInternalResult = obi.decode(remaining)
      value[k] = decodeInternalResult[0]
      remaining = decodeInternalResult[1]
    }
    return [value, remaining]
  }
}

export class ObiString extends ObiBase {
  static REGEX = /^string$/

  encode(value: string): Buffer {
    return Buffer.concat([
      new ObiInteger('u32').encode(BigInt(value.length)),
      Buffer.from(value),
    ])
  }

  decode(buff: Buffer): any[] {
    let [length, remaining] = new ObiInteger('u32').decode(buff)
    return [
      remaining.slice(0, parseInt(length)).toString(),
      remaining.slice(parseInt(length)),
    ]
  }
}

export class ObiBytes {
  static REGEX = /^bytes$/

  encode(value: any): Buffer {
    return Buffer.concat([
      new ObiInteger('u32').encode(value.length),
      Buffer.from(value),
    ])
  }

  decode(buff: Buffer): any[] {
    let [length, remaining] = new ObiInteger('u32').decode(buff)
    return [
      remaining.slice(0, parseInt(length)),
      remaining.slice(parseInt(length)),
    ]
  }
}

export class Obi {
  inputObi: ObiBase
  outputObi: ObiBase

  constructor(schema: string) {
    const normalizedSchema = schema.replace(/\s+/g, '')
    const tokens = normalizedSchema.split('/')
    this.inputObi = ObiSpec.fromSpec(tokens[0])
    this.outputObi = ObiSpec.fromSpec(tokens[1])
  }

  encodeInput(value: any): Buffer {
    return this.inputObi.encode(value)
  }

  decodeInput(buff: Buffer): any {
    const [value, remaining] = this.inputObi.decode(buff)
    if (remaining.length != 0)
      throw new DecodeError('Not all data is consumed after decoding output')
    return value
  }

  encodeOutput(value: any): Buffer {
    return this.outputObi.encode(value)
  }

  decodeOutput(buff: Buffer): any {
    const [value, remaining] = this.outputObi.decode(buff)
    if (remaining.length != 0)
      throw new DecodeError('Not all data is consumed after decoding output')
    return value
  }
}

export class ObiSpec {
  static impls = [
    ObiInteger,
    ObiBool,
    ObiVector,
    ObiStruct,
    ObiString,
    ObiBytes,
  ]

  static fromSpec(schema: string): ObiBase {
    for (let impl of ObiSpec.impls) {
      if (schema.match(impl.REGEX)) {
        return new impl(schema)
      }
    }

    throw new SchemaError(`No schema matched: <${schema}>`)
  }
}
