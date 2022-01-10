import { useState, useEffect } from "react";
import { createWallet, getWallet } from "../band";
import { useDispatch } from "react-redux";
import { addWallet } from "../redux/walletSlice";
export default function FormGenerateWallet() {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState("");

  useEffect(() => {
    setMnemonic(createWallet());
  }, []);

  const handleConnectButton = (e) => {
    e.preventDefault();
    if (mnemonic.length > 0 && mnemonic !== "") {
      const { walletAddress } = getWallet(mnemonic);
      if (walletAddress) {
        dispatch(
          addWallet({
            address: walletAddress,
            mnemonic: mnemonic,
          })
        );
      }
    }
  };

  return (
    <div>
      <p className="text-xs mb-4">
        Please, make sure you have carefully written down your recovery phrase somewhere safe. You
        will need this phrase to use and restore your wallet. Phrase is case sensitive.
      </p>
      <div className="card-inner">
        <div className="mb-5">
          <div className="input-group mb-3">
            <label htmlFor="input-address" className="block text-sm font-medium text-gray-700 mb-1">
              Your Recovery phrase
            </label>
            <textarea
              className="h-20 focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
              type="text"
              id="input-address"
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              disabled
            />
          </div>
        </div>
        <button
          onClick={(e) => handleConnectButton(e)}
          className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out"
        >
          Yes, I have written it down
        </button>
      </div>
    </div>
  );
}
