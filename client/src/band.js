import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from "@bandprotocol/bandchain.js";
import { MsgBeginRedelegate } from "@bandprotocol/bandchain.js/proto/cosmos/staking/v1beta1/tx_pb";
import moment from "moment";

const grpcUrl = "https://laozi-testnet4.bandchain.org/grpc-web";
const client = new Client(grpcUrl);

export async function getPairPrice(pair, minCount, askCount) {
  const data = await client.getReferenceData(pair, minCount, askCount);
  return data;
}

export function getWallet(mnemonic) {
  const { PrivateKey } = Wallet;
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  const pubkey = privateKey.toPubkey();
  const sender = pubkey.toAddress().toAccBech32();
  return { sender, privateKey, pubkey };
}

export async function makeRequest(symbols, multiplier, feeInput, prepareGas, executeGas) {
  symbols = symbols.toUpperCase().replace(/\s/g, "").split(",");

  // Step 1: Import a private key for signing transaction
  const { PrivateKey } = Wallet;
  const mnemonic = "s";
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  const pubkey = privateKey.toPubkey();
  const sender = pubkey.toAddress().toAccBech32();

  // Step 2.1: Prepare oracle request's properties
  const obi = new Obi("{symbols:[string],multiplier:u64}/{rates:[u64]}");
  const calldata = obi.encodeInput({ symbols: symbols, multiplier: multiplier });

  const oracleScriptId = 37;
  const askCount = 2;
  const minCount = 1;
  const clientId = "from_bandchain.js";

  let feeLimit = new Coin();
  feeLimit.setDenom("uband");
  feeLimit.setAmount(feeInput);

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
  );

  const txRawBytes = await createSignedTransaction(requestMessage, sender, pubkey, privateKey);

  // Step 4: Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes);
  // console.log(sendTx);
  // if (sendTx) decodeData(obi.encodeOutput(calldata).toString("hex"));

  return sendTx;
}

function decodeData(data) {
  const obi = new Obi("{symbols:[string],multiplier:u64}/{rates:[u64]}");
  const dataBuffer = Buffer.from(
    "0000000400000003455448000000054d41544943000000034254430000000455534443000000003b9aca00",
    "hex"
  );
  // const decoded = obi.decodeOutput(
  //   Buffer.from(
  //     "0000086df1baab00000000000200000009436f696e4765636b6f000000005eca223d0000000d43727970746f436f6d70617265000000005eca2252",
  //     "hex"
  //   )
  // );
  // const decode = obi.decodeOutput(dataBuffer).toString("hex");
  // console.log(decode);
  console.log(obi.decodeOutput(dataBuffer));
}

export const sendCoin = async (address, amount, privateKey, pubkey, sender, action = "send") => {
  const { MsgSend, MsgDelegate } = Message;

  const receiver = address;
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());

  const msg =
    action === "delegate"
      ? new MsgDelegate(sender, receiver, sendAmount)
      : new MsgSend(sender, receiver, [sendAmount]);

  const txRawBytes = await createSignedTransaction(msg, sender, pubkey, privateKey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(txRawBytes);

  return response;
};

export const undelegateCoin = async (operator, amount, privateKey, pubkey, sender) => {
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());

  const { MsgUndelegate } = Message;
  const msg = new MsgUndelegate(sender, operator, sendAmount);
  const txRawBytes = await createSignedTransaction(msg, sender, pubkey, privateKey);
  const response = await client.sendTxBlockMode(txRawBytes);

  return response;
};

export const reDelegateCoin = async (
  srcOperator,
  destOperator,
  amount,
  privateKey,
  pubkey,
  sender
) => {
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());

  const { MsgBeginRedelegate } = Message;
  const msg = new MsgBeginRedelegate(sender, srcOperator, destOperator, sendAmount);
  const txRawBytes = await createSignedTransaction(msg, sender, pubkey, privateKey);
  const response = await client.sendTxBlockMode(txRawBytes);

  return response;
};

export const reinvestRewards = async (validator, privateKey, pubkey, sender) => {
  // const sendAmount = new Coin();
  // sendAmount.setDenom("uband");
  // sendAmount.setAmount((amount * 1e6).toString());

  const { MsgWithdrawDelegatorReward } = Message;
  const msg = new MsgWithdrawDelegatorReward(sender, validator);
  const txRawBytes = await createSignedTransaction(msg, sender, pubkey, privateKey);
  const response = await client.sendTxBlockMode(txRawBytes);

  return response;
};

export const sendIBC = async (address, amount, privateKey, pubkey, sender) => {
  const { MsgTransfer } = Message;

  // Here we use different message type, which is MsgSend
  const receiver = address;
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());
  const timeoutTimestamp = moment().unix() * 1e9;

  const msg = new MsgTransfer(
    "transfer",
    "channel-25",
    sender,
    receiver,
    sendAmount,
    timeoutTimestamp
  );

  const signedTx = await createSignedTransaction(msg, sender, pubkey, privateKey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(signedTx);

  return response;
};

export const createDataSource = async (
  title,
  code,
  sender,
  owner,
  treasury,
  privateKey,
  pubkey,
  ...desc
) => {
  const { MsgCreateDataSource } = Message;
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const msg = MsgCreateDataSource(title, code, [feeCoin], treasury, owner, sender, desc);

  // const msg = new Message.MsgCreateDataSource(title, code, [feeCoin], treasury, owner, sender);

  const signedTx = await createSignedTransaction(msg, sender, pubkey, privateKey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(signedTx);

  return response;
};

export const editDataSource = async (id, code, sender, owner, privateKey, pubkey, ...args) => {
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const msg = new Message.MsgEditDataSource(parseInt(id), code, [feeCoin], owner, sender);

  const signedTx = await createSignedTransaction(msg, sender, pubkey, privateKey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(signedTx);

  return response;
};

export async function createOracleScript(
  title,
  desc,
  schema,
  source_code_url,
  code,
  sender,
  owner,
  privateKey,
  pubkey
) {
  let coin = new Coin();
  coin.setDenom("uband");
  coin.setAmount("1000000");

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const requestMessage = new Message.MsgCreateOracleScript(
    title,
    desc,
    schema,
    source_code_url,
    Buffer.from(code),
    owner,
    sender
  );

  const signedTx = await createSignedTransaction(requestMessage, sender, pubkey, privateKey);
  const sendTx = await client.sendTxBlockMode(signedTx);

  return sendTx;
}

export async function createMsgEditOS(
  id,
  title,
  desc,
  schema,
  source_code_url,
  code,
  sender,
  owner,
  privateKey,
  pubkey
) {
  let coin = new Coin();
  coin.setDenom("uband");
  coin.setAmount("1000000");

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const requestMessage = new Message.MsgEditOracleScript(
    id,
    title,
    desc,
    schema,
    source_code_url,
    Buffer.from(code),
    owner,
    sender
  );

  const signedTx = await createSignedTransaction(requestMessage, sender, pubkey, privateKey);
  const sendTx = await client.sendTxBlockMode(signedTx);

  return sendTx;
}

export async function getRawPreview(
  title,
  desc,
  schema,
  source_code_url,
  code,
  sender,
  owner,
  privateKey,
  pubkey
) {
  let coin = new Coin();
  coin.setDenom("uband");
  coin.setAmount("1000000");

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const requestMessage = new Message.MsgCreateOracleScript(
    title,
    desc,
    schema,
    source_code_url,
    Buffer.from(code),
    owner,
    sender
  );

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);
  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(requestMessage);
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withFee(fee);
  txn.withMemo("");

  const signDoc = txn.getSignDoc(pubkey);
  const signature = privateKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubkey);

  return txRawBytes;
}

export async function getRawPreviewEditOs(
  title,
  desc,
  schema,
  source_code_url,
  code,
  sender,
  owner,
  privateKey,
  pubkey
) {
  let coin = new Coin();
  coin.setDenom("uband");
  coin.setAmount("1000000");

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const requestMessage = new Message.MsgCreateOracleScript(
    title,
    desc,
    schema,
    source_code_url,
    Buffer.from(code),
    owner,
    sender
  );

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);
  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(requestMessage);
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withFee(fee);
  txn.withMemo("");

  const signDoc = txn.getSignDoc(pubkey);
  const signature = privateKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubkey);

  return txRawBytes;
}

export async function withdrawReward(delegator, validator, sender, pubkey, privateKey) {
  const msg = new Message.MsgWithdrawDelegatorReward(delegator, validator);
  const signedTx = await createSignedTransaction(msg, sender, pubkey, privateKey);
  const response = await client.sendTxBlockMode(signedTx);
  return response;
}

export async function createSignedTransaction(msg, sender, pubkey, privateKey) {
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);
  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(msg);
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withFee(fee);
  txn.withMemo("From Bandchain.js Demo App");

  const signDoc = txn.getSignDoc(pubkey);
  const signature = privateKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubkey);

  return txRawBytes;
}
