import React, { useState, useMemo, useEffect } from "react";
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
        <div className="mx-auto px-10">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-start">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-lg">
                  <strong>BandChain.js</strong>
                </h1>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end">
              <div className="flex-shrink-0 flex items-center">
                {isConnected ? (
                  <WalletDropdown />
                ) : (
                  <button
                    onClick={(e) => setIsShow(!isShow)}
                    className="button bg-yellow-400 text-blue text-lg py-2 px-6 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-yellow-500 focus:ring-opacity-50"
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
