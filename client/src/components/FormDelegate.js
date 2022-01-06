import { useState, useEffect } from "react";
import { Message, Coin } from "@bandprotocol/bandchain.js";
import { getWallet, broadCastTx } from "../band";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import UnableService from "./UnableService";
import AccountWithBalance from "./AccountWithBalance";

function FormDelegate() {
  const wallet = useSelector((state) => state.wallet);

  const [validator, setValidator] = useState("bandvaloper1zkf9qzs7ayf3uqksxqwve8q693dsdhxk800wvw");
  const [isConnected, setisConnected] = useState(false);
  const [amount, setAmount] = useState("");
  const [sendResult, setSendResult] = useState("");
  const [sendResultSuccess, setSendResultSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (wallet.address) {
      setisConnected(true);
    } else {
      setisConnected(false);
    }
  }, [wallet]);

  const handleInputValidator = (e) => {
    if (e.target.value) setValidator(e.target.value);
  };

  const handleInputAmount = (e) => {
    if (e.target.value) setAmount(e.target.value);
  };

  const sendBandToken = async () => {
    if (!validator && !amount) return;
    setLoading(true);
    const response = await sendCoin();

    if (response.data === "") setSendResult(response.rawLog);
    if (response.data !== "") {
      setTransactions((transactions) => [...transactions, response.txhash]);
      setSendResultSuccess(response.txhash);
    }
    setLoading(false);
  };

  const sendCoin = async () => {
    const { walletAddress } = getWallet(wallet.mnemonic);
    const { MsgDelegate } = Message;

    const sendAmount = new Coin();
    sendAmount.setDenom("uband");
    sendAmount.setAmount((amount * 1e6).toString());

    const msg = new MsgDelegate(walletAddress, validator, sendAmount);

    // Step 5 send the transaction
    const response = await broadCastTx(msg, wallet.mnemonic);

    return response;
  };

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full md:w-4/12 mb-8 md:mb-0">
        <h2 className="mb-5 text-3xl ">
          <strong>Delegate Token</strong>
        </h2>
        <p className="mb-5">
          The message used for this service is
          <a
            href="https://docs.bandchain.org/client-library/bandchain.js/get-started.html#send-band-token"
            target="_blank"
            rel="noreferrer"
          >
            <strong> MsgDelegate</strong>
          </a>
        </p>
      </div>
      <div className="w-full md:w-8/12 md:pl-10">
        {!isConnected ? (
          <UnableService />
        ) : (
          <div>
            <div className="card bg-white border-2 border-black rounded rounded-2xl w-full mb-10">
              <AccountWithBalance />
              <div className="card-inner p-6 ">
                <div className="mb-5">
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Delegate to
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                      type="text"
                      id="input-address"
                      value={validator}
                      onChange={handleInputValidator}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Token Amount (BAND)
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                      type="number"
                      step="0.01"
                      id="input-amount"
                      onChange={handleInputAmount}
                      value={amount}
                    />
                  </div>
                </div>
                <button
                  onClick={sendBandToken}
                  className="button block w-full text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-4 rounded-xl focus:outline-none"
                >
                  Delegate
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-5">Latest Transactions</h3>
            {loading ? (
              <Loading />
            ) : transactions.length > 0 ? (
              transactions.map((tx) => {
                return (
                  <a
                    className="text-black mb-3 p-3 border-2 border-gray-200 hover:border-blue rounded-xl block"
                    href={`https://laozi-testnet4.cosmoscan.io/tx/${tx}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tx}
                  </a>
                );
              })
            ) : (
              <div className="text-md">You don't have any transactions</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormDelegate;
