import { useState } from "react";
import { getWallet } from "../band";
import { useDispatch } from "react-redux";
import { addWallet } from "../redux/walletSlice";
import { gql, useLazyQuery } from "@apollo/client";

export default function FormConnectWallet() {
  const dispatch = useDispatch();
  const [mnemonic, setMnemonic] = useState("");

  const GET_BALANCE = gql`
    query GetBalance($address: String!) {
      accounts(where: { address: { _eq: $address } }) {
        balance
      }
    }
  `;

  const [getBalance, { error, data }] = useLazyQuery(GET_BALANCE);

  const handleConnectButton = (e) => {
    if (mnemonic.length > 0 && mnemonic !== "") {
      const { sender, privateKey, pubkey } = getWallet(mnemonic);

      if (sender) {
        getBalance({ variables: { address: sender } });
        if (data) {
          const uband = data.accounts[0].balance.split("uband")[0];
          dispatch(
            addWallet({
              address: sender,
              name: sender,
              privateKey: privateKey,
              pubkey: pubkey,
              balance: uband / 1e6,
            })
          );
        }
        if (error) console.error(error);
      }
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
              className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
              type="text"
              id="input-address"
              valur={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={(e) => handleConnectButton(e)}
          className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
