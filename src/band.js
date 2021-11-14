import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from "@bandprotocol/bandchain.js";
import moment from 'moment';

const grpcUrl = 'https://laozi-testnet4.bandchain.org/grpc-web';
const client = new Client(grpcUrl)

export async function makeRequest(symbols) {
    symbols = symbols.split(',')
    console.log(symbols)
    // Step 1: Import a private key for signing transaction
    const { PrivateKey } = Wallet
    const mnemonic = "subject economy equal whisper turn boil guard giraffe stick retreat wealth card only buddy joy leave genuine resemble submit ghost top polar adjust avoid"
    const privateKey = PrivateKey.fromMnemonic(mnemonic)
    const pubkey = privateKey.toPubkey()
    const sender = pubkey.toAddress().toAccBech32()
    // console.log(sender)
    // const sender = "band1jrhuqrymzt4mnvgw8cvy3s9zhx3jj0dq30qpte"
  
    // Step 2.1: Prepare oracle request's properties
    const obi = new Obi("{symbols:[string],multiplier:u64}/{rates:[u64]}")
    const calldata = obi.encodeInput({ symbols: symbols, multiplier: 100 })
  
    const oracleScriptId = 37
    const askCount = 2
    const minCount = 1
    const clientId = "from_bandchain.js"
  
    let feeLimit = new Coin()
    feeLimit.setDenom("uband")
    feeLimit.setAmount("10")
  
    const prepareGas = 100000
    const executeGas = 200000
  
    // Step 2.2: Create an oracle request message
    const requestMessage = new Message.MsgRequestData(
      oracleScriptId,
      calldata,
      askCount,
      minCount,
      clientId,
      sender,
      [feeLimit],
      prepareGas,
      executeGas
    )
  
    let feeCoin = new Coin()
    feeCoin.setDenom("uband")
    feeCoin.setAmount("50000")
  
    // Step 3.1: Construct a transaction
    const fee = new Fee()
    fee.setAmountList([feeCoin])
    fee.setGasLimit(1000000)
  
    const chainId = await client.getChainId()
    const txn = new Transaction()
    txn.withMessages(requestMessage)
    await txn.withSender(client, sender)
    txn.withChainId(chainId)
    txn.withFee(fee)
    txn.withMemo("Test Send Oracle Request from Babybun")
  
    // Step 3.2: Sign the transaction using the private key
    const signDoc = txn.getSignDoc(pubkey)
    const signature = privateKey.sign(signDoc)
  
    const txRawBytes = txn.getTxData(signature, pubkey)
  
    // Step 4: Broadcast the transaction
    const sendTx = await client.sendTxBlockMode(txRawBytes)
    return sendTx
  }

  export const sendCoin = async (address, amount, action='send', chainId='band-laozi-testnet4') => {
    console.log(address)
    // Step 3.1 constructs MsgSend message
    const { MsgSend, MsgDelegate, MsgTransfer } = Message
      // Step 1: Import a private key for signing transaction
    const { PrivateKey } = Wallet
    const mnemonic = "subject economy equal whisper turn boil guard giraffe stick retreat wealth card only buddy joy leave genuine resemble submit ghost top polar adjust avoid"
    const privateKey = PrivateKey.fromMnemonic(mnemonic)
    const pubkey = privateKey.toPubkey()
    const sender = pubkey.toAddress().toAccBech32()

    // Here we use different message type, which is MsgSend
    const receiver = address
    const sendAmount = new Coin()
    sendAmount.setDenom("uband")
    sendAmount.setAmount(amount)

    const msg = action === 'delegate' ? new MsgDelegate(sender, receiver, sendAmount): action === 'transfer' ? new MsgTransfer(sender, receiver, sendAmount) : new MsgSend(sender, receiver, [sendAmount]);

    // Step 3.2 constructs a transaction
    const account = await client.getAccount(sender)
    console.log(account)
  
    let feeCoin = new Coin()
    feeCoin.setDenom("uband")
    feeCoin.setAmount("1000")
  
    const fee = new Fee()
    fee.setAmountList([feeCoin])
    fee.setGasLimit(1000000)
    const tx = new Transaction()
      .withMessages(msg)
      .withAccountNum(account.accountNumber)
      .withSequence(account.sequence)
      .withChainId(chainId)
      .withFee(fee)
  
    // Step 4 sign the transaction
    const txSignData = tx.getSignDoc(pubkey)
    const signature = privateKey.sign(txSignData)
    const signedTx = tx.getTxData(signature, pubkey)
  
    // Step 5 send the transaction
    const response = await client.sendTxBlockMode(signedTx)

    return response
  }


  export const sendIBC = async (address, amount) => {
    // Step 3.1 constructs MsgSend message
    const { MsgTransfer } = Message
      // Step 1: Import a private key for signing transaction
    const { PrivateKey } = Wallet
    const mnemonic = "subject economy equal whisper turn boil guard giraffe stick retreat wealth card only buddy joy leave genuine resemble submit ghost top polar adjust avoid"
    const privateKey = PrivateKey.fromMnemonic(mnemonic)
    const pubkey = privateKey.toPubkey()
    const sender = pubkey.toAddress().toAccBech32()

    // Here we use different message type, which is MsgSend
    const receiver = address
    const sendAmount = new Coin()
    sendAmount.setDenom("uband")
    sendAmount.setAmount(amount)
    const timeoutTimestamp = new Date().getTime() + 600;
    console.log(timeoutTimestamp)

    const msg = new MsgTransfer('transfer', 'channel-25', sender, receiver, sendAmount, timeoutTimestamp)

    // Step 3.2 constructs a transaction
    const account = await client.getAccount(sender)
  
    let feeCoin = new Coin()
    feeCoin.setDenom("uband")
    feeCoin.setAmount("1000")
  
    const fee = new Fee()
    fee.setAmountList([feeCoin])
    fee.setGasLimit(1000000)
    const tx = new Transaction()
      .withMessages(msg)
      .withAccountNum(account.accountNumber)
      .withSequence(account.sequence)
      .withChainId('band-laozi-testnet4')
      .withFee(fee)
  
    // Step 4 sign the transaction
    const txSignData = tx.getSignDoc(pubkey)
    const signature = privateKey.sign(txSignData)
    const signedTx = tx.getTxData(signature, pubkey)
  
    // Step 5 send the transaction
    const response = await client.sendTxBlockMode(signedTx)
    console.log(response);

    return response
  }

