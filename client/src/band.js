import { Client, Wallet, Message, Coin, Transaction, Fee } from "@bandprotocol/bandchain.js";
import moment from "moment";
import { grpcUrl } from "./api";

const client = new Client(grpcUrl);

export async function getPairPrice(pair, minCount, askCount) {
  try {
    const data = await client.getReferenceData(pair, minCount, askCount);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export function createWallet() {
  const { PrivateKey } = Wallet;
  const [mnemonic, priv] = PrivateKey.generate("m/44'/494'/0'/0/3");
  return mnemonic;
}

export function getWallet(mnemonic) {
  const { PrivateKey } = Wallet;
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  const pubkey = privateKey.toPubkey();
  const walletAddress = pubkey.toAddress().toAccBech32();
  return { walletAddress, pubkey, privateKey };
}

export const undelegateCoin = async (operator, amount, wallet) => {
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());

  const { MsgUndelegate } = Message;
  const msg = new MsgUndelegate(wallet.address, operator, sendAmount);
  const response = await broadCastTx(msg, wallet.mnemonic);

  return response;
};

export const reDelegateCoin = async (srcOperator, destOperator, amount, wallet) => {
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());

  const { MsgBeginRedelegate } = Message;
  const msg = new MsgBeginRedelegate(wallet.address, srcOperator, destOperator, sendAmount);
  const response = await broadCastTx(msg, wallet.mnemonic);

  return response;
};

export const reinvestRewards = async (validator, wallet) => {
  const { MsgWithdrawDelegatorReward } = Message;
  const msg = new MsgWithdrawDelegatorReward(wallet.address, validator);
  const response = await broadCastTx(msg, wallet.mnemonic);

  return response;
};

export async function withdrawReward(delegator, validator, wallet) {
  const msg = new Message.MsgWithdrawDelegatorReward(delegator, validator);
  const response = await broadCastTx(msg, wallet.mnemonic);
  return response;
}

export const sendIBC = async (receiver, amount, wallet) => {
  const { MsgTransfer } = Message;
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());
  const timeoutTimestamp = moment().unix() * 1e9;

  const msg = new MsgTransfer(
    "transfer",
    "channel-25",
    wallet.address,
    receiver,
    sendAmount,
    timeoutTimestamp
  );

  const response = await broadCastTx(msg, wallet.mnemonic);
  return response;
};

// TODO: Waiting for the function in bandchain.js being merged
export const createDataSource = async (title, code, owner, treasury, wallet, ...desc) => {
  const { MsgCreateDataSource } = Message;
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const msg = MsgCreateDataSource(title, code, [feeCoin], treasury, owner, wallet.address, desc);

  const response = await broadCastTx(msg, wallet.mnemonic);

  return response;
};

// TODO: Waiting for the function in bandchain.js being merged
export const editDataSource = async (id, code, owner, wallet, ...args) => {
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const msg = new Message.MsgEditDataSource(parseInt(id), code, [feeCoin], owner, wallet.address);

  const response = await broadCastTx(msg, wallet.mnemonic);

  return response;
};

export async function createOracleScript(postData, wallet) {
  const { name, desc, schema, url, code, owner } = postData;
  console.log(name);

  const requestMessage = new Message.MsgCreateOracleScript(
    name,
    code,
    owner,
    wallet.address,
    desc,
    schema,
    url
  );

  const response = await broadCastTx(requestMessage, wallet.mnemonic);

  return response;
}

// TODO: Waiting for the function in bandchain.js being merged
export async function editOracleScript(postData, wallet) {
  const { id, name, desc, schema, url, code, owner } = postData;
  const requestMessage = new Message.MsgEditOracleScript(
    id,
    code,
    owner,
    wallet.address,
    name,
    desc,
    schema,
    url
  );

  const response = await broadCastTx(requestMessage, wallet.mnemonic);

  return response;
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
    code,
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

export async function broadCastTx(msg, mnemonic) {
  const { walletAddress, pubkey, privateKey } = getWallet(mnemonic);

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);

  try {
    const chainId = await client.getChainId();

    const txn = new Transaction();
    txn.withMessages(msg);

    await txn.withSender(client, walletAddress);
    txn.withChainId(chainId);
    txn.withFee(fee);
    txn.withMemo("From Bandchain.js Demo App");

    const signDoc = txn.getSignDoc(pubkey);
    const signature = privateKey.sign(signDoc);

    const signedTx = txn.getTxData(signature, pubkey);

    const response = await client.sendTxBlockMode(signedTx);
    return response;
  } catch (err) {
    console.error(err);
    return;
  }
}
