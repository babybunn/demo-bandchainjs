import { useEffect, useState } from "react";
import { sendIBC } from "../band";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import UnableService from "./UnableService";
import AccountWithBalance from "./AccountWithBalance";

function FormSendToken() {
  const wallet = useSelector((state) => state.wallet);
  const [isConnected, setisConnected] = useState(false);

  const [tokenAmount, setTokenAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState(
    "band1jrhuqrymzt4mnvgw8cvy3s9zhx3jj0dq30qpte"
  );
  const [sendResult, setSendResult] = useState("");
  const [sendResultSuccess, setSendResultSuccess] = useState("");
  const [loading, setLoading] = useState(Boolean(0));
  const ibcchannel = "CONSUMER";

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (wallet.address) {
      setisConnected(true);
    } else {
      setisConnected(false);
    }
  }, [wallet]);

  const handleInputTokenAmount = (e) => {
    setTokenAmount(e.target.value);
  };
  const handleInputAddress = (e) => {
    setReceiverAddress(e.target.value);
  };
  const sendBandToken = async () => {
    if (!receiverAddress && !tokenAmount) return;
    setLoading(Boolean(1));
    const response = await sendIBC(
      receiverAddress,
      tokenAmount,
      wallet.privateKey,
      wallet.pubkey,
      wallet.address
    );
    console.log(response);
    if (response.height === 0) {
      setSendResult(response.rawLog);
    }
    if (response.data !== "") {
      setSendResultSuccess(response.txhash);
    }
    setTransactions((transactions) => [...transactions, response.txhash]);
    setLoading(Boolean(0));
  };

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full md:w-4/12 mb-8 md:mb-0">
        <h2 className="mb-5 text-3xl ">
          <strong>Send BAND token via IBC</strong>
        </h2>
        <p className="mb-5">
          The message used for this service is
          <a
            href="https://docs.bandchain.org/client-library/bandchain.js/get-started.html#send-band-token"
            target="_blank"
            rel="noreferrer"
          >
            <strong> MsgTransfer</strong>
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
              <div className="card-inner p-6">
                <div className="mb-5">
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-channel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Channel
                    </label>
                    <input
                      className="text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-channel"
                      value={ibcchannel}
                      disabled
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Recipient Address
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-address"
                      value={receiverAddress}
                      onChange={handleInputAddress}
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
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="number"
                      id="input-amount"
                      value={tokenAmount}
                      onChange={handleInputTokenAmount}
                    />
                  </div>
                </div>
                <button
                  onClick={sendBandToken}
                  className="button block w-full text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-4 rounded-xl focus:outline-none"
                >
                  Send
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-5">Latest Transactions</h3>
            {loading ? (
              <Loading />
            ) : transactions.length > 0 ? (
              transactions.map((tx, ind) => {
                return (
                  <a
                    className="text-black mb-3 p-3 border-2 border-gray-200 hover:border-blue rounded-xl block"
                    href={`https://laozi-testnet4.cosmoscan.io/tx/${tx}`}
                    key={ind}
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

export default FormSendToken;
