import { useState, useEffect } from "react";
import { getWallet } from "../band";
import { useDispatch } from "react-redux";
import { addWallet } from "../redux/walletSlice";

export default function FormConnectWallet() {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState("");

  const handleConnectButton = () => {
    if (mnemonic.length > 0 && mnemonic !== "") {
      const { sender, privateKey, pubkey } = getWallet(mnemonic);
      dispatch(
        addWallet({
          address: sender,
          name: sender,
          privateKey: privateKey,
          pubkey: pubkey,
        })
      );
    }
  };

  return (
    <div>
      <div className="card-inner">
        <div className="mb-5">
          <div className="input-group mb-3">
            <label htmlFor="input-address" className="block text-sm font-medium text-gray-700 mb-1">
              Enter mnemonic phrase
            </label>
            <input
              className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md"
              type="text"
              id="input-address"
              valur={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleConnectButton}
          className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
