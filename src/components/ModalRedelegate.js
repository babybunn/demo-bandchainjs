import { useState, useContext } from "react";
import { reDelegateCoin } from "../band";
import { useSelector } from "react-redux";
import { ModalDelegateContext } from "../app-context";
import { gql, useQuery } from "@apollo/client";

export default function ModalRedelegate({ title, operator }) {
  const { isShowModalRedelegate, setIsShowModalRedelegate } = useContext(ModalDelegateContext);
  const wallet = useSelector((state) => state.wallet);
  const [modalloading, setmodalloading] = useState(false);
  const [txhash, settxhash] = useState("");
  const [amount, setAmount] = useState(0);
  const [destvalidator, setdestvalidator] = useState("");

  const closeModalHandler = () => {
    setmodalloading(false);
    setIsShowModalRedelegate(false);
  };

  const confirm = async () => {
    setmodalloading(true);
    console.log(operator);
    console.log(destvalidator);

    const response = await reDelegateCoin(
      operator,
      destvalidator,
      amount,
      wallet.privateKey,
      wallet.pubkey,
      wallet.address
    );
    if (response) {
      settxhash(response.txhash);
    }
  };

  const GET_VALIDATORS = gql`
    query GetValidators {
      validators {
        moniker
        operator_address
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_VALIDATORS);

  return (
    <div
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      className={
        isShowModalRedelegate
          ? "fixed z-10 inset-0 overflow-y-auto block"
          : " fixed z-10 inset-0 overflow-y-auto hidden"
      }
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
            <div className="flex justify-between align-items-center mt-3 mb-5 text-center sm:mt-0 sm:text-left">
              <h2 className="mb-0 text-xl capitalize">
                <strong>Redelegate</strong>
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange cursor-pointer hover:text-orange-dark"
                onClick={(e) => closeModalHandler(e)}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {modalloading ? (
              txhash ? (
                <div>
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
                    className="overflow-ellipsis overflow-hidden text-black mb-3 block hover:text-blue"
                    href={`https://laozi-testnet4.cosmoscan.io/tx/${txhash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {txhash}
                  </a>
                </div>
              ) : (
                <div>
                  <h2>Sending...</h2>
                </div>
              )
            ) : (
              <div className="modal-body">
                <div className="form-delegate-wrapper mb-5">
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Redelegate From
                    </label>
                    <p>{operator}</p>
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-validator"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Redelegate To
                    </label>
                    <select
                      className="border-2 border-gray-200 rounded-xl w-full px-3 py-2"
                      onChange={(e) => setdestvalidator(e.target.value)}
                    >
                      {data ? (
                        data.validators.map((validator) => (
                          <option value={validator.operator_address}>{validator.moniker}</option>
                        ))
                      ) : (
                        <option value="">Select Validator</option>
                      )}
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <label
                      htmlFor="input-amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Amount
                    </label>
                    <input
                      className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                      type="number"
                      id="input-amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={confirm}
                  className="capitalize button block w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out"
                >
                  Redelegate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
