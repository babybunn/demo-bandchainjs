import { useEffect, useState } from "react";
import { sendCoin } from "../band";
import { useSelector } from "react-redux";
import UnableService from "./UnableService";
import AccountWithBalance from "./AccountWithBalance";

export default function FormCreateDataSource() {
  const wallet = useSelector((state) => state.wallet);
  const [isConnected, setisConnected] = useState(false);

  useEffect(() => {
    if (wallet.address) {
      setisConnected(true);
    } else {
      setisConnected(false);
    }
  }, [wallet]);

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full md:w-4/12 mb-8 md:mb-0">
        <h2 className="mb-5 text-3xl ">
          <strong>Create a new data source</strong>
        </h2>
        <p className="mb-5">
          <a
            href="https://docs.bandchain.org/client-library/bandchain.js/get-started.html#send-band-token"
            target="_blank"
            rel="noreferrer"
          >
            <strong>MsgCreateDataSource</strong>
          </a>{" "}
          is a message for creating a new data source.
        </p>
      </div>
      <div className="w-full md:w-8/12 md:pl-10">
        {!isConnected ? (
          <UnableService />
        ) : (
          <div>
            <div className="card bg-white border-2 border-black rounded rounded-2xl w-full mb-10">
              <div className="card-inner p-6">
                <div className="mb-5">
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Data Source Name
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-address"
                      onChange={(e) => console.log(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-sender"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sender Address
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-sender"
                      onChange={(e) => console.log(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-owner"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Owner Address
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-owner"
                      onChange={(e) => console.log(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-treasury"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Treasury Address
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                      type="text"
                      id="input-treasury"
                      onChange={(e) => console.log(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="input-file"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Data Source File (.py format)
                    </label>
                    <input type="file" accept="text/x-python-script" id="input-file" />
                  </div>
                </div>
                <button className="button block w-full text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-4 rounded-xl focus:outline-none">
                  Add a new data source
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
