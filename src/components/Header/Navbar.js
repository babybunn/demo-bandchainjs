import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ModalConnectWallet from "./ModalConnectWallet";
import { ModalContext } from "../../app-context";
import { useSelector } from "react-redux";
import WalletDropdown from "./WalletDropdown";

function Navbar() {
  const [isShow, setIsShow] = useState(false);
  const value = useMemo(() => ({ isShow, setIsShow }), [isShow]);
  const wallet = useSelector((state) => state.wallet);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (wallet.address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [wallet]);

  return (
    <React.Fragment>
      <nav className="bg-white rounded-2xl">
        <div className="mx-auto md:px-10 p-3 md:py-0">
          <div className="relative flex items-center justify-between md:h-16">
            <div className="flex-1 flex items-center justify-start">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex md:items-end">
                  <h1 className="text-md md:text-xl">
                    <strong>
                      <Link to="/" className="hover:text-blue">
                        BandChain.js
                      </Link>
                    </strong>
                  </h1>
                  <div className="text-lg md:ml-2 flex items-center">
                    <span className="hidden md:inline-block">Playgr</span>
                    <span className="logo-ball w-3 h-3  mx-1 block bg-orange rounded-full animate-bounce"></span>
                    <span className="hidden md:inline-block">und</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end">
              <div className="flex-shrink-0 flex items-center">
                {isConnected ? (
                  <WalletDropdown />
                ) : (
                  <button
                    onClick={(e) => setIsShow(!isShow)}
                    className="button text-blue text-sm md:text-lg py-2 px-2 md:px-6 rounded-lg bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-yellow-500 focus:ring-opacity-50"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <ModalContext.Provider value={value}>
        <ModalConnectWallet />
      </ModalContext.Provider>
    </React.Fragment>
  );
}

export default Navbar;
