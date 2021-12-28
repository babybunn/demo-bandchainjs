import { useState, useContext } from "react";
import { sendCoin, undelegateCoin } from "../band";
import { useSelector } from "react-redux";
import { ModalDelegateContext } from "../app-context";

export default function ModalDelegate({ title, operator }) {
  const { isShowModal, setIsShowModal } = useContext(ModalDelegateContext);
  const wallet = useSelector((state) => state.wallet);
  const [loading, setloading] = useState(false);
  const [txhash, settxhash] = useState("");
  const [amount, setAmount] = useState(0);

  const closeModalHandler = () => {
    setloading(false);
    setIsShowModal(false);
  };

  const confirm = async () => {
    setloading(true);

    const response =
      title === "delegate"
        ? await sendCoin(
            operator,
            amount,
            wallet.privateKey,
            wallet.pubkey,
            wallet.address,
            "delegate"
          )
        : await undelegateCoin(operator, amount, wallet.privateKey, wallet.pubkey, wallet.address);
    if (response) {
      settxhash(response.txhash);
    }
  };

  return (
    <div
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      className={
        isShowModal
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
                <strong>{title}</strong>
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
            {loading ? (
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
                      Delegate {title === "delegate" ? `To` : `From`}
                    </label>
                    <p>{operator}</p>
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
                  {title}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
