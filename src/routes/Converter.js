import { useState, useEffect } from "react";
import { getPairPrice } from "../band";
export default function Converter() {
  const [inputSource, setinputSource] = useState(1);
  const [symbolSource, setsymbolSource] = useState("BTC");
  const [inputDest, setinputDest] = useState(1);
  const [symbolDest, setsymbolDest] = useState("USD");
  const [rate, setRate] = useState(0);

  const symbols = [
    "USD",
    "JPY",
    "THB",
    "AUD",
    "EUR",
    "BTC",
    "ETH",
    "BNB",
    "USDT",
    "SOL",
    "LUNA",
    "BAND",
  ];

  const getPrice = async (pair) => {
    const response = await getPairPrice(pair, 10, 16);
    setRate(response[0].rate);
  };

  const handleSelectSourceChanged = (e) => {
    setsymbolSource(e.target.value);
    getPrice([`${e.target.value}/${symbolDest}`]);
  };

  const handleSelectDestChanged = (e) => {
    setsymbolDest(e.target.value);
    getPrice([`${symbolSource}/${e.target.value}`]);
  };

  const handleInputSourceChange = (val) => {
    setinputSource(val);
    setinputDest((val * rate).toFixed(2));
  };

  useEffect(() => {
    if (symbolSource != "") getPrice([`${symbolSource}/${symbolDest}`]);
  }, []);

  useEffect(() => {
    setinputDest((inputSource * rate).toFixed(2));
  }, [rate]);

  return (
    <div>
      <h1 className="text-2xl mb-5">
        <strong>Cryptocurrency Converter Calculator</strong>
      </h1>
      <div className="">
        <div className="form-converter-group md:flex gap-2 items-center">
          <div className="form flex-1 flex-grow">
            <label className="text-gray-400 font-medium">From</label>
            <div className="input-group mb-3">
              <select
                className="bg-white border-2 border-gray-200 rounded-xl w-full px-3 py-2"
                onChange={(e) => handleSelectSourceChanged(e)}
                value={symbolSource}
              >
                {symbols.map((symbol) => (
                  <option value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <input
                className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 text-5xl border-solid border-2 border-gray-200 rounded-xl"
                type="text"
                id="input-srcPrice"
                value={inputSource}
                onChange={(e) => handleInputSourceChange(e.target.value)}
              />
            </div>
          </div>
          <div className="mx-auto mt-3 w-10 h-10 border-2 border-black rounded-full flex items-center justify-center bg-orange">
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div className="form  flex-1 flex-grow">
            <label className="text-gray-400 font-medium">To</label>
            <div className="input-group mb-3">
              <select
                className="bg-white border-2 border-gray-200 rounded-xl w-full px-3 py-2"
                onChange={(e) => handleSelectDestChanged(e)}
                value={symbolDest}
              >
                {symbols.map((symbol) => (
                  <option value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <input
                className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 text-5xl border-solid border-2 border-gray-200 rounded-xl"
                type="text"
                id="input-desc"
                value={inputDest}
                onChange={(e) => setinputDest(e.target.value)}
                disabled="disabled"
              />
            </div>
          </div>
          <div className="flex"></div>
        </div>
      </div>
    </div>
  );
}
