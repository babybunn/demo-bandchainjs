import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function AccountWithBalanceCenter() {
  const wallet = useSelector((state) => state.wallet);
  const [fullAddress, setFullAddress] = useState("");
  const [copied, setcopied] = useState(false);
  const [accountAddress, setaccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    if (wallet.address) {
      const orgStr = wallet.address;
      const subStr = orgStr.substr(0, 20) + "..." + orgStr.substr(orgStr.length - 4, orgStr.length);
      setaccountAddress(subStr);
      setFullAddress(orgStr);
      setAccountBalance(wallet.balance);
    } else {
      setaccountAddress("");
      setFullAddress("");
    }
  }, [wallet]);

  return (
    <div className="">
      <div className="card-balance card-top  p-6 w-full rounded-xl">
        <div className="account-avatar">
          <div className="avatar w-full">
            <img
              src="/images/avatar-4.png"
              alt=""
              style={{ maxWidth: "100px" }}
              className="block mx-auto mb-6"
            />
          </div>
          <div className="w-full block">
            <div className="flex justify-center">
              <h3 className="text-sm font-bold">{accountAddress} </h3>
              <div className="relative">
                <CopyToClipboard text={fullAddress} onCopy={() => setcopied(true)}>
                  <button className="ml-3 hover:text-orange group relative inline-block align-baseline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: "16px", height: "16px" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="tooltip-content absolute opacity-0 group-hover:opacity-100 text-xs bg-black rounded-md py-1 px-2 text-white transform -translate-x-1/2 left-1/2">
                      {copied ? "Copied" : "Copy"}
                    </div>
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
        <div className="account-balance mt-3 border-b-4 border-2 border-black p-3 rounded-xl bg-yellow-50 flex justify-between items-center">
          <div>
            <p className="text-sm mb-1">Balance:</p>
            <h3 className="text-md font-bold">{accountBalance ? accountBalance : "0"} BAND</h3>
          </div>
          <button className="button bg-white hover:bg-orange flex items-center justify-center w-10 h-10 rounded-full border-2 border-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
