"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgEditOracleScript = exports.MsgCreateOracleScript = exports.MsgEditDataSource = exports.MsgCreateDataSource = exports.MsgTransfer = exports.MsgVote = exports.MsgWithdrawDelegatorReward = exports.MsgBeginRedelegate = exports.MsgUndelegate = exports.MsgDelegate = exports.MsgSend = exports.MsgRequestData = void 0;
const any_pb_1 = require("google-protobuf/google/protobuf/any_pb");
const constant_1 = require("./constant");
const error_1 = require("./error");
const tx_pb_1 = require("../proto/oracle/v1/tx_pb");
const tx_pb_2 = require("../proto/cosmos/bank/v1beta1/tx_pb");
const tx_pb_3 = require("../proto/cosmos/staking/v1beta1/tx_pb");
const tx_pb_4 = require("../proto/cosmos/distribution/v1beta1/tx_pb");
const gov_pb_1 = require("../proto/cosmos/gov/v1beta1/gov_pb");
const tx_pb_5 = require("../proto/ibc/applications/transfer/v1/tx_pb");
class MsgRequestData extends tx_pb_1.MsgRequestData {
    constructor(oracleScriptId, calldata, askCount, minCount, clientId, sender, feeLimitList = [], prepareGas = 50000, executeGas = 300000) {
        super();
        this.setOracleScriptId(oracleScriptId);
        this.setCalldata(calldata);
        this.setAskCount(askCount);
        this.setMinCount(minCount);
        this.setClientId(clientId);
        this.setFeeLimitList(feeLimitList);
        this.setPrepareGas(prepareGas);
        this.setExecuteGas(executeGas);
        this.setSender(sender);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'oracle.v1.MsgRequestData';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'oracle/Request',
            value: {
                ask_count: this.getAskCount().toString(),
                calldata: this.getCalldata_asB64(),
                oracle_script_id: this.getOracleScriptId().toString(),
                min_count: this.getMinCount().toString(),
                client_id: this.getClientId(),
                sender: this.getSender(),
                fee_limit: this.getFeeLimitList().map((coin) => coin.toObject()),
                prepare_gas: this.getPrepareGas().toString(),
                execute_gas: this.getExecuteGas().toString(),
            },
        };
    }
    validate() {
        if (this.getOracleScriptId() <= 0)
            throw new error_1.NegativeIntegerError('oracleScriptId cannot be less than zero');
        if (!Number.isInteger(this.getOracleScriptId()))
            throw new error_1.ValueError('oracleScriptId is not an integer');
        if (!Number.isInteger(this.getAskCount()))
            throw new error_1.ValueError('askCount is not an integer');
        if (!Number.isInteger(this.getMinCount()))
            throw new error_1.ValueError('minCount is not an integer');
        if (this.getCalldata().length > constant_1.MAX_DATA_SIZE)
            throw new error_1.ValueTooLargeError('Too large calldata');
        if (this.getMinCount() <= 0)
            throw new error_1.ValueError(`Invalid minCount, got: minCount: ${this.getMinCount()}`);
        if (this.getAskCount() < this.getMinCount())
            throw new error_1.ValueError(`Invalid askCount got: minCount: ${this.getMinCount()}, askCount: ${this.getAskCount()}`);
        this.getFeeLimitList().forEach((coin) => {
            if (Number(coin.getAmount()) && Number(coin.getAmount()) < 0) {
                throw new error_1.NegativeIntegerError('Fee limit cannot be less than zero');
            }
            else if (!Number(coin.getAmount())) {
                throw new error_1.NotIntegerError('Invalid fee limit, fee limit should be a number');
            }
        });
    }
}
exports.MsgRequestData = MsgRequestData;
class MsgSend extends tx_pb_2.MsgSend {
    constructor(from, to, amountList) {
        super();
        this.setFromAddress(from);
        this.setToAddress(to);
        this.setAmountList(amountList);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'cosmos.bank.v1beta1.MsgSend';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgSend',
            value: {
                from_address: this.getFromAddress(),
                to_address: this.getToAddress(),
                amount: this.getAmountList().map((coin) => coin.toObject()),
            },
        };
    }
    validate() {
        if (this.getAmountList().length === 0) {
            throw new error_1.InsufficientCoinError('Expect at least 1 coin');
        }
        if (this.getToAddress() === '' || this.getFromAddress() === '') {
            throw new error_1.ValueError('Address should not be an empty string');
        }
    }
}
exports.MsgSend = MsgSend;
class MsgDelegate extends tx_pb_3.MsgDelegate {
    constructor(delegator, validator, amount) {
        super();
        this.setDelegatorAddress(delegator);
        this.setValidatorAddress(validator);
        this.setAmount(amount);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'cosmos.staking.v1beta1.MsgDelegate';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgDelegate',
            value: {
                delegator_address: this.getDelegatorAddress(),
                validator_address: this.getValidatorAddress(),
                amount: this.getAmount().toObject(),
            },
        };
    }
    validate() {
        if (this.getAmount() === undefined) {
            throw new error_1.InsufficientCoinError('Expect at least 1 coin');
        }
        if (this.getDelegatorAddress() === '' ||
            this.getValidatorAddress() === '') {
            throw new error_1.ValueError('Address should not be an empty string');
        }
    }
}
exports.MsgDelegate = MsgDelegate;
class MsgUndelegate extends tx_pb_3.MsgUndelegate {
    constructor(delegator, validator, amount) {
        super();
        this.setDelegatorAddress(delegator);
        this.setValidatorAddress(validator);
        this.setAmount(amount);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'cosmos.staking.v1beta1.MsgUndelegate';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgUndelegate',
            value: {
                delegator_address: this.getDelegatorAddress(),
                validator_address: this.getValidatorAddress(),
                amount: this.getAmount().toObject(),
            },
        };
    }
    validate() {
        if (this.getAmount() === undefined) {
            throw new error_1.InsufficientCoinError('Expect at least 1 coin');
        }
        if (this.getDelegatorAddress() === '' ||
            this.getValidatorAddress() === '') {
            throw new error_1.ValueError('Address should not be an empty string');
        }
    }
}
exports.MsgUndelegate = MsgUndelegate;
class MsgBeginRedelegate extends tx_pb_3.MsgBeginRedelegate {
    constructor(delegator, srcValidator, dstValidator, amount) {
        super();
        this.setDelegatorAddress(delegator);
        this.setValidatorSrcAddress(srcValidator);
        this.setValidatorDstAddress(dstValidator);
        this.setAmount(amount);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'cosmos.staking.v1beta1.MsgBeginRedelegate';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgBeginRedelegate',
            value: {
                delegator_address: this.getDelegatorAddress(),
                validator_src_address: this.getValidatorSrcAddress(),
                validator_dst_address: this.getValidatorDstAddress(),
                amount: this.getAmount().toObject(),
            },
        };
    }
    validate() {
        if (this.getAmount() === undefined) {
            throw new error_1.InsufficientCoinError('Expect at least 1 coin');
        }
        if (this.getDelegatorAddress() === '' ||
            this.getValidatorSrcAddress() === '' ||
            this.getValidatorDstAddress() === '') {
            throw new error_1.ValueError('Address should not be an empty string');
        }
    }
}
exports.MsgBeginRedelegate = MsgBeginRedelegate;
class MsgWithdrawDelegatorReward extends tx_pb_4.MsgWithdrawDelegatorReward {
    constructor(delegator, validator) {
        super();
        this.setDelegatorAddress(delegator);
        this.setValidatorAddress(validator);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgWithdrawDelegationReward',
            value: {
                delegator_address: this.getDelegatorAddress(),
                validator_address: this.getValidatorAddress(),
            },
        };
    }
    validate() {
        if (this.getDelegatorAddress() === '' ||
            this.getValidatorAddress() === '') {
            throw new error_1.ValueError('Address should not be an empty string');
        }
    }
}
exports.MsgWithdrawDelegatorReward = MsgWithdrawDelegatorReward;
class MsgVote extends gov_pb_1.Vote {
    constructor(proposalId, voter, option) {
        super();
        this.setProposalId(proposalId);
        this.setVoter(voter);
        this.setOption(option);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'cosmos.gov.v1beta1.MsgVote';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgVote',
            value: {
                proposal_id: this.getProposalId().toString(),
                voter: this.getVoter(),
                option: this.getOption(),
            },
        };
    }
    validate() {
        if (this.getProposalId() <= 0) {
            throw new error_1.NegativeIntegerError('proposalId cannot be less than zero');
        }
        if (this.getVoter() === '') {
            throw new error_1.ValueError('Address should not be an empty string');
        }
        if (this.getOption() === gov_pb_1.VoteOption.VOTE_OPTION_UNSPECIFIED) {
            throw new error_1.ValueError('VoteOption should not be VOTE_OPTION_UNSPECIFIED');
        }
    }
}
exports.MsgVote = MsgVote;
class MsgTransfer extends tx_pb_5.MsgTransfer {
    constructor(sourcePort, sourceChannel, sender, receiver, token, timeoutTimestamp) {
        super();
        this.setSourcePort(sourcePort);
        this.setSourceChannel(sourceChannel);
        this.setSender(sender);
        this.setReceiver(receiver);
        this.setToken(token);
        this.setTimeoutTimestamp(timeoutTimestamp);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'ibc.applications.transfer.v1.MsgTransfer';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'cosmos-sdk/MsgTransfer',
            value: {
                source_port: this.getSourcePort(),
                source_channel: this.getSourceChannel(),
                sender: this.getSender(),
                receiver: this.getReceiver(),
                token: this.getToken().toObject(),
                timeout_height: {},
                timeout_timestamp: this.getTimeoutTimestamp().toString(),
            },
        };
    }
    validate() {
        if (this.getSourcePort() === '') {
            throw new error_1.ValueError('sourcePort should not be an empty string');
        }
        if (this.getSourceChannel() === '') {
            throw new error_1.ValueError('sourceChannel should not be an empty string');
        }
        if (this.getSender() === '') {
            throw new error_1.ValueError('sender should not be an empty string');
        }
        if (this.getReceiver() === '') {
            throw new error_1.ValueError('receiver should not be an empty string');
        }
    }
}
exports.MsgTransfer = MsgTransfer;
class MsgCreateDataSource extends tx_pb_1.MsgCreateDataSource {
    constructor(name, executable, feeList = [], treasury, owner, sender, description) {
        super();
        this.setName(name);
        this.setDescription(description);
        this.setExecutable(executable);
        this.setTreasury(treasury);
        this.setOwner(owner);
        this.setFeeList(feeList);
        this.setSender(sender);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'oracle.v1.MsgCreateDataSource';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'oracle/CreateDataSource',
            value: {
                name: this.getName().toString(),
                description: this.getDescription().toString(),
                executable: this.getExecutable_asB64(),
                feeList: this.getFeeList().map((coin) => coin.toObject()),
                treasury: this.getTreasury().toString(),
                owner: this.getOwner().toString(),
                sender: this.getSender().toString(),
            },
        };
    }
    validate() {
        if (this.getName() === '')
            throw new error_1.ValueError('name should not be an empty string');
        if (this.getSender() === '')
            throw new error_1.ValueError('sender should not be an empty string');
        if (this.getOwner() === '')
            throw new error_1.ValueError('owner should not be an empty string');
        if (this.getTreasury() === '')
            throw new error_1.ValueError('treasury should not be an empty string');
        if (this.getExecutable().length == 0)
            throw new error_1.ValueError('got an empty source file');
        this.getFeeList().map((coin) => {
            if (Number(coin.getAmount()) && Number(coin.getAmount()) < 0) {
                throw new error_1.NegativeIntegerError('Fee cannot be less than zero');
            }
            else if (!Number(coin.getAmount())) {
                throw new error_1.NotIntegerError('Invalid fee, fee list should be a number');
            }
        });
    }
}
exports.MsgCreateDataSource = MsgCreateDataSource;
class MsgEditDataSource extends tx_pb_1.MsgEditDataSource {
    constructor(dataSourceId, executable, feeList = [], treasury, owner, sender, name, description) {
        super();
        this.setDataSourceId(dataSourceId);
        this.setName(name);
        this.setDescription(description);
        this.setExecutable(executable);
        this.setTreasury(treasury);
        this.setOwner(owner);
        this.setFeeList(feeList);
        this.setSender(sender);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'oracle.v1.MsgEditDataSource';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'oracle/EditDataSource',
            value: {
                dataSourceId: this.getDataSourceId(),
                name: this.getName().toString(),
                description: this.getDescription().toString(),
                executable: this.getExecutable_asB64(),
                feeList: this.getFeeList().map((coin) => coin.toObject()),
                treasury: this.getTreasury().toString(),
                owner: this.getOwner().toString(),
                sender: this.getSender().toString(),
            },
        };
    }
    validate() {
        if (!this.getDataSourceId())
            throw new error_1.ValueError('dataSourceId cannot be null');
        if (this.getSender() === '')
            throw new error_1.ValueError('sender should not be an empty string');
        if (this.getOwner() === '')
            throw new error_1.ValueError('owner should not be an empty string');
        if (this.getTreasury() === '')
            throw new error_1.ValueError('treasury should not be an empty string');
        if (this.getExecutable().length === 0)
            throw new error_1.ValueError('got an empty source file');
        this.getFeeList().map((coin) => {
            if (Number(coin.getAmount()) && Number(coin.getAmount()) < 0) {
                throw new error_1.NegativeIntegerError('Fee cannot be less than zero');
            }
            else if (!Number(coin.getAmount())) {
                throw new error_1.NotIntegerError('Invalid fee, fee list should be a number');
            }
        });
    }
}
exports.MsgEditDataSource = MsgEditDataSource;
class MsgCreateOracleScript extends tx_pb_1.MsgCreateOracleScript {
    constructor(name, code, owner, sender, description, schema, sourceCodeUrl) {
        super();
        this.setName(name);
        this.setDescription(description);
        this.setSchema(schema);
        this.setSourceCodeUrl(sourceCodeUrl);
        this.setCode(code);
        this.setOwner(owner);
        this.setSender(sender);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'oracle.v1.MsgCreateOracleScript';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'oracle/CreateOracleScript',
            value: {
                name: this.getName().toString(),
                description: this.getDescription().toString(),
                schema: this.getSchema().toString,
                sourceCodeUrl: this.getSourceCodeUrl().toString(),
                code: this.getCode().toString(),
                owner: this.getOwner().toString(),
                sender: this.getSender().toString(),
            },
        };
    }
    validate() {
        if (this.getName() === '')
            throw new error_1.ValueError('name should not be an empty string');
        if (this.getSender() === '')
            throw new error_1.ValueError('sender should not be an empty string');
        if (this.getOwner() === '')
            throw new error_1.ValueError('owner should not be an empty string');
        if (this.getCode().length === 0)
            throw new error_1.ValueError('code should not be an empty string');
    }
}
exports.MsgCreateOracleScript = MsgCreateOracleScript;
class MsgEditOracleScript extends tx_pb_1.MsgEditOracleScript {
    constructor(oracleScriptId, code, owner, sender, name, description, schema, sourceCodeUrl) {
        super();
        this.setOracleScriptId(oracleScriptId);
        this.setCode(code);
        this.setOwner(owner);
        this.setSender(sender);
        this.setName(name);
        this.setDescription(description);
        this.setSchema(schema);
        this.setSourceCodeUrl(sourceCodeUrl);
    }
    toAny() {
        this.validate();
        const anyMsg = new any_pb_1.Any();
        const name = 'oracle.v1.MsgEditOracleScript';
        anyMsg.pack(this.serializeBinary(), name, '/');
        return anyMsg;
    }
    toJSON() {
        return {
            type: 'oracle/EditOracleScript',
            value: {
                oracleScriptId: this.getOracleScriptId(),
                code: this.getCode(),
                owner: this.getOwner().toString(),
                sender: this.getSender().toString(),
                name: this.getName().toString(),
                description: this.getDescription().toString(),
                schema: this.getSchema().toString,
                sourceCodeUrl: this.getSourceCodeUrl().toString(),
            },
        };
    }
    validate() {
        if (this.getSender() === '')
            throw new error_1.ValueError('sender should not be an empty string');
        if (this.getOwner() === '')
            throw new error_1.ValueError('owner should not be an empty string');
        if (this.getCode().length === 0)
            throw new error_1.ValueError('code should not be an empty string');
    }
}
exports.MsgEditOracleScript = MsgEditOracleScript;