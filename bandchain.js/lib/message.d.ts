/// <reference types="node" />
import { Any } from 'google-protobuf/google/protobuf/any_pb';
import { MsgRequestData as MsgRequestDataProto, MsgCreateDataSource as MsgCreateDataSourceProto, MsgEditDataSource as MsgEditDataSourceProto, MsgCreateOracleScript as MsgCreateOracleScriptProto, MsgEditOracleScript as MsgEditOracleScriptProto } from '../proto/oracle/v1/tx_pb';
import { MsgSend as MsgSendProto } from '../proto/cosmos/bank/v1beta1/tx_pb';
import { MsgDelegate as MsgDelegateProto, MsgUndelegate as MsgUndelegateProto, MsgBeginRedelegate as MsgBeginRedelegateProto } from '../proto/cosmos/staking/v1beta1/tx_pb';
import { MsgWithdrawDelegatorReward as MsgWithdrawDelegatorRewardProto } from '../proto/cosmos/distribution/v1beta1/tx_pb';
import { Vote as MsgVoteProto, VoteOptionMap } from '../proto/cosmos/gov/v1beta1/gov_pb';
import { MsgTransfer as MsgTransferProto } from '../proto/ibc/applications/transfer/v1/tx_pb';
import { Coin } from '../proto/cosmos/base/v1beta1/coin_pb';
import { Message as JSPBMesage } from 'google-protobuf';
export interface BaseMsg extends JSPBMesage {
    toJSON(): object;
    toAny(): Any;
}
export declare class MsgRequestData extends MsgRequestDataProto implements BaseMsg {
    constructor(oracleScriptId: number, calldata: Buffer, askCount: number, minCount: number, clientId: string, sender: string, feeLimitList?: Coin[], prepareGas?: number, executeGas?: number);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgSend extends MsgSendProto implements BaseMsg {
    constructor(from: string, to: string, amountList: Coin[]);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgDelegate extends MsgDelegateProto implements BaseMsg {
    constructor(delegator: string, validator: string, amount: Coin);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgUndelegate extends MsgUndelegateProto implements BaseMsg {
    constructor(delegator: string, validator: string, amount: Coin);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgBeginRedelegate extends MsgBeginRedelegateProto implements BaseMsg {
    constructor(delegator: string, srcValidator: string, dstValidator: string, amount: Coin);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgWithdrawDelegatorReward extends MsgWithdrawDelegatorRewardProto implements BaseMsg {
    constructor(delegator: string, validator: string);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgVote extends MsgVoteProto implements BaseMsg {
    constructor(proposalId: number, voter: string, option: VoteOptionMap[keyof VoteOptionMap]);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgTransfer extends MsgTransferProto implements BaseMsg {
    constructor(sourcePort: string, sourceChannel: string, sender: string, receiver: string, token: Coin, timeoutTimestamp: number);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgCreateDataSource extends MsgCreateDataSourceProto implements BaseMsg {
    constructor(name: string, executable: string, feeList: Coin[], treasury: string, owner: string, sender: string, description?: string);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgEditDataSource extends MsgEditDataSourceProto implements BaseMsg {
    constructor(dataSourceId: number, executable: string, feeList: Coin[], treasury: string, owner: string, sender: string, name?: string, description?: string);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgCreateOracleScript extends MsgCreateOracleScriptProto implements BaseMsg {
    constructor(name: string, code: Buffer, owner: string, sender: string, description?: string, schema?: string, sourceCodeUrl?: string);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
export declare class MsgEditOracleScript extends MsgEditOracleScriptProto implements BaseMsg {
    constructor(oracleScriptId: number, code: Buffer, owner: string, sender: string, name?: string, description?: string, schema?: string, sourceCodeUrl?: string);
    toAny(): Any;
    toJSON(): object;
    validate(): void;
}
