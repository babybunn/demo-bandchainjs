import { broadCastTx } from "../band";
import { Obi, Message, Coin } from "@bandprotocol/bandchain.js";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import UnableService from "./UnableService";
import AccountWithBalance from "./AccountWithBalance";

function FormSendRequest() {
  const wallet = useSelector((state) => state.wallet);
  const [isConnected, setisConnected] = useState(false);

  const [sendResultError, setSendResultError] = useState("");
  // const [sendResult, setSendResult] = useState([]);
  const [symbols, setSymbols] = useState("");
  const [multiplierInput, setMultiplierInput] = useState("");
  const [feeInput, setFeeInput] = useState("");
  const [prepareGasInput, setPrepareGasInput] = useState("");
  const [executeGasInput, setExecuteGasInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);

  const [transactions, setTransactions] = useState("");

  useEffect(() => {
    if (wallet.address) {
      setisConnected(true);
    } else {
      setisConnected(false);
    }
  }, [wallet]);

  const sendRequest = async () => {
    setFormStep(formStep + 1);
    if (!symbols && !multiplierInput && !feeInput && !prepareGasInput && !executeGasInput) return;
    setLoading(Boolean(1));
    const requestID = await makeRequest();

    if (requestID.data === "") {
      setSendResultError(requestID.rawLog);
    }

    setTransactions(requestID.txhash);
    setLoading(false);
  };

  const makeRequest = async () => {
    const obi = new Obi("{symbols:[string],multiplier:u64}/{rates:[u64]}");
    const calldata = obi.encodeInput({
      symbols: symbols.toUpperCase().replace(/\s/g, "").split(","),
      multiplier: multiplierInput,
    });

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
      wallet.address, // sender
      [feeLimit],
      prepareGasInput,
      executeGasInput
    );

    const tx = await broadCastTx(requestMessage, wallet.mnemonic);
    return tx;
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
              {formStep === 0 ? (
                <>
                  <div className="card-inner p-6">
                    <div className="mb-5 form-container">
                      <div className="input-group mb-3">
                        <label
                          htmlFor="input-address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Symbols (Separate with comma)
                        </label>
                        <input
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          type="text"
                          id="input-address"
                          value={symbols}
                          onChange={(e) => setSymbols(e.target.value)}
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
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          min="0"
                          type="number"
                          id="input-multiplier"
                          value={multiplierInput}
                          onChange={(e) => setMultiplierInput(e.target.value)}
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
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          min="0"
                          type="number"
                          id="input-fee"
                          value={feeInput}
                          onChange={(e) => setFeeInput(e.target.value)}
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
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          min="0"
                          type="number"
                          id="input-gas1"
                          value={prepareGasInput}
                          onChange={(e) => setPrepareGasInput(e.target.value)}
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
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          min="0"
                          type="number"
                          id="input-gas2"
                          value={executeGasInput}
                          onChange={(e) => setExecuteGasInput(e.target.value)}
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
                </>
              ) : loading ? (
                <div className="form-wrapper flex items-center justify-center">
                  <div className="form-container">
                    <Loading />
                  </div>
                </div>
              ) : transactions !== "" ? (
                sendResultError ? (
                  <div className="form-wrapper flex items-center justify-center">
                    <div className="form-container p-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-orange mx-auto mb-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="text-orange text-center mb-5">{sendResultError}</div>
                      <button
                        onClick={(e) => setFormStep(formStep - 1)}
                        className="button block mx-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 form-wrapper flex items-center justify-center">
                    <div className="form-container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-green-400 mx-auto mb-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h4 className="text-md text-center">
                        <strong>Transaction Hash</strong>
                      </h4>
                      <a
                        className="overflow-ellipsis overflow-hidden text-black mb-3 block hover:text-blue text-center"
                        href={`https://laozi-testnet4.cosmoscan.io/tx/${transactions}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {transactions}
                      </a>
                      <button
                        onClick={(e) => setFormStep(formStep - 1)}
                        className="button block mx-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <>
                  <div className="text-md">You don't have any transactions</div>
                  <button onClick={(e) => setFormStep(formStep - 1)}>Back</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormSendRequest;
