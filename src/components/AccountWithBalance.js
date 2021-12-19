import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function AccountWithBalance() {
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
    <div className="card-balance card-top border-b-2 border-black p-6 flex items-center justify-between">
      <div className="account-avatar flex items-center">
        <div className="avatar w-20 h-20 mr-5">
          <img src="/images/avatar-4.png" alt="" />
        </div>
        <div className="flex items-center">
          <h3 className="text-lg font-bold">{accountAddress} </h3>
          <div className="relative">
            <CopyToClipboard text={fullAddress} onCopy={() => setcopied(true)}>
              <button className="ml-3 hover:text-orange group relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
      <div className="account-balance">
        <p className="text-right text-gray-500">Available Balance:</p>
        <h3 className="text-3xl font-bold text-right">
          {accountBalance ? <div>{accountBalance}</div> : "0"} BAND
        </h3>
      </div>
    </div>
  );
}
