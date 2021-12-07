import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeWallet } from "../../redux/walletSlice";

export default function WalletDropdown() {
  const wallet = useSelector((state) => state.wallet);
  const [account, setaccount] = useState("");
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet.address) {
      const orgStr = wallet.address;
      const subStr = orgStr.substr(0, 8) + "..." + orgStr.substr(orgStr.length - 4, orgStr.length);
      setaccount(subStr);
    }
  }, [wallet]);
  return (
    <div className="relative inline-block">
      <div>
        <button
          onClick={(e) => setToggleDropdown(!toggleDropdown)}
          className="inline-flex justify-center items-center w-full rounded-md font-bold text-lg py-2 px-6 rounded-lg text-white bg-black hover:bg-black focus:outline-none"
        >
          <span className="inline-block mr-1">{account}</span>
          <svg
            className=" h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div
        className={`origin-top-right absolute right-0 mt-2 w-full border-2 border-black rounded-lg shadow-lg bg-white focus:outline-none${
          toggleDropdown ? "" : " hidden"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-1" role="none">
          <a
            href="#"
            className="text-black block px-4 py-2 font-bold hover:bg-warmGray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-0"
          >
            Settings
          </a>
          <button
            onClick={(e) => dispatch(removeWallet({}))}
            type="submit"
            className="text-orange block w-full text-left px-4 py-2 font-bold hover:bg-warmGray-100"
            role="menuitem"
            tabIndex="-1"
            id="menu-item-3"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
