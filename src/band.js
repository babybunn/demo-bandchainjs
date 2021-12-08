import { Client, Wallet, Obi, Message, Coin, Transaction, Fee } from "@bandprotocol/bandchain.js";
import moment from "moment";

const grpcUrl = "https://laozi-testnet4.bandchain.org/grpc-web";
const client = new Client(grpcUrl);

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
  const mnemonic =
    "subject economy equal whisper turn boil guard giraffe stick retreat wealth card only buddy joy leave genuine resemble submit ghost top polar adjust avoid";
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  const pubkey = privateKey.toPubkey();
  const sender = pubkey.toAddress().toAccBech32();

  // Step 2.1: Prepare oracle request's properties
  const obi = new Obi("{symbols:[string],multiplier:u64}/{rates:[u64]}");
  const calldata = obi.encodeInput({ symbols: [symbols], multiplier: multiplier });

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

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("50000");

  // Step 3.1: Construct a transaction
  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(10000000);

  const chainId = await client.getChainId();
  const txn = new Transaction();
  txn.withMessages(requestMessage);
  await txn.withSender(client, sender);
  txn.withChainId(chainId);
  txn.withFee(fee);
  txn.withMemo("Test Send Oracle Request from Babybun");

  // Step 3.2: Sign the transaction using the private key
  const signDoc = txn.getSignDoc(pubkey);
  const signature = privateKey.sign(signDoc);

  const txRawBytes = txn.getTxData(signature, pubkey);

  // Step 4: Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes);
  return sendTx;
}

export const sendCoin = async (
  address,
  amount,
  privateKey,
  pubkey,
  sender,
  action = "send",
  chainId = "band-laozi-testnet4"
) => {
  const { MsgSend, MsgDelegate } = Message;

  const receiver = address;
  const sendAmount = new Coin();
  sendAmount.setDenom("uband");
  sendAmount.setAmount((amount * 1e6).toString());

  const msg =
    action === "delegate"
      ? new MsgDelegate(sender, receiver, sendAmount)
      : new MsgSend(sender, receiver, [sendAmount]);

  const account = await client.getAccount(sender);
  console.log(account);

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);
  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId(chainId)
    .withFee(fee);

  // Step 4 sign the transaction
  const txSignData = tx.getSignDoc(pubkey);
  const signature = privateKey.sign(txSignData);
  const signedTx = tx.getTxData(signature, pubkey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(signedTx);

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

  // Step 3.2 constructs a transaction
  const account = await client.getAccount(sender);

  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);
  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId("band-laozi-testnet4")
    .withFee(fee);

  // Step 4 sign the transaction
  const txSignData = tx.getSignDoc(pubkey);
  const signature = privateKey.sign(txSignData);
  const signedTx = tx.getTxData(signature, pubkey);

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
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const msg = new Message.MsgCreateDataSource(title, code, [feeCoin], treasury, owner, sender);

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);

  const account = await client.getAccount(sender);

  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId("band-laozi-testnet4")
    .withFee(fee);

  // Step 4 sign the transaction
  const txSignData = tx.getSignDoc(pubkey);
  const signature = privateKey.sign(txSignData);
  const signedTx = tx.getTxData(signature, pubkey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(signedTx);

  return response;
};

export const editDataSource = async (id, code, sender, owner, privateKey, pubkey, ...args) => {
  let feeCoin = new Coin();
  feeCoin.setDenom("uband");
  feeCoin.setAmount("1000");

  const msg = new Message.MsgEditDataSource(parseInt(id), code, [feeCoin], owner, sender);

  const fee = new Fee();
  fee.setAmountList([feeCoin]);
  fee.setGasLimit(1000000);

  const account = await client.getAccount(sender);

  const tx = new Transaction()
    .withMessages(msg)
    .withAccountNum(account.accountNumber)
    .withSequence(account.sequence)
    .withChainId("band-laozi-testnet4")
    .withFee(fee);

  // Step 4 sign the transaction
  const txSignData = tx.getSignDoc(pubkey);
  const signature = privateKey.sign(txSignData);
  const signedTx = tx.getTxData(signature, pubkey);

  // Step 5 send the transaction
  const response = await client.sendTxBlockMode(signedTx);

  return response;
};
