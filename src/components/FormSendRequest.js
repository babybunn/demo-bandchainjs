import { makeRequest } from "../band";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import UnableService from "./UnableService";
import AccountWithBalance from "./AccountWithBalance";

function FormSendRequest() {
  const wallet = useSelector((state) => state.wallet);
  const [isConnected, setisConnected] = useState(false);

  const [sendResultError, setSendResultError] = useState("");
  const [sendResult, setSendResult] = useState([]);
  const [symbols, setSymbols] = useState("");
  const [multiplierInput, setMultiplierInput] = useState("");
  const [feeInput, setFeeInput] = useState("");
  const [prepareGasInput, setPrepareGasInput] = useState("");
  const [executeGasInput, setExecuteGasInput] = useState("");
  const [loading, setLoading] = useState(Boolean(0));

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (wallet.address) {
      setisConnected(true);
    } else {
      setisConnected(false);
    }
  }, [wallet]);

  const sendRequest = async () => {
    if (!symbols && !multiplierInput && !feeInput && !prepareGasInput && !executeGasInput) return;
    setLoading(Boolean(1));
    const requestID = await makeRequest(
      symbols,
      multiplierInput,
      feeInput,
      prepareGasInput,
      executeGasInput
    );
    // console.log(requestID)
    if (requestID.data === "") {
      setSendResultError(requestID.rawLog);
    }

    if (requestID.data !== "") {
      console.log(requestID);
      setSendResult(requestID.logsList[0].eventsList[2].attributesList);
      console.log(sendResult);
    }
    setTransactions(requestID.txhash);
    setLoading(Boolean(0));
  };

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full md:w-4/12 mb-8 md:mb-0">
        <h2 className="mb-5 text-3xl ">
          <strong>Create a new request</strong>
        </h2>
        <p className="mb-5">
          <a
            href="https://docs.bandchain.org/client-library/bandchain.js/get-started.html#send-band-token"
            target="_blank"
            rel="noreferrer"
          >
            <strong>MsgRequestData</strong>
          </a>{" "}
          is a message for sending a data oracle request.
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
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Symbols (Separate with comma)
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-address"
                      value={symbols}
                      onChange={(e) => (e.target.value ? setSymbols(e.target.value) : "")}
                      placeholder="e.g BTC,ETH"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Multiplier (u64)
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      min="0"
                      type="number"
                      id="input-multiplier"
                      value={multiplierInput}
                      onChange={(e) => (e.target.value ? setMultiplierInput(e.target.value) : "")}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Fee Limit (uband)
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      min="0"
                      type="number"
                      id="input-fee"
                      value={feeInput}
                      onChange={(e) => (e.target.value ? setFeeInput(e.target.value) : "")}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Prepare Gas
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      min="0"
                      type="number"
                      id="input-gas1"
                      value={prepareGasInput}
                      onChange={(e) => (e.target.value ? setPrepareGasInput(e.target.value) : "")}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Execute Gas
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      min="0"
                      type="number"
                      id="input-gas2"
                      value={executeGasInput}
                      onChange={(e) => (e.target.value ? setExecuteGasInput(e.target.value) : "")}
                    />
                  </div>
                </div>
                <button
                  onClick={sendRequest}
                  className="button block w-full text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-4 rounded-xl focus:outline-none"
                >
                  Send a Request
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-5">Latest Transactions</h3>
            {loading ? (
              <Loading />
            ) : transactions.length > 0 ? (
              sendResultError ? (
                <div className="mt-5 text-red-500">{sendResultError}</div>
              ) : (
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
              )
            ) : (
              <div className="text-md">You don't have any transactions</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormSendRequest;
