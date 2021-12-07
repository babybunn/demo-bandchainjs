import { useEffect, useState } from "react";
import { Client } from "@bandprotocol/bandchain.js";
import CardPrice from "./CardPrice";

function FormGetPrice() {
  const defaultPair = [
    "BTC/USD",
    "ETH/USD",
    "BNB/USD",
    "LUNA/USD",
    "DOT/USD",
    "BAND/USD",
    "ALPHA/USD",
  ];
  // states
  const [prices, setPrice] = useState([]);
  const [pairInput, setPairInput] = useState("");
  const [minCount, setminCount] = useState(10);
  const [askCount, setaskCount] = useState(16);

  useEffect(() => {
    getPrice(defaultPair);
  }, []);

  async function getPrice(pair = []) {
    const grpcUrl = "https://laozi-testnet4.bandchain.org/grpc-web";
    const client = new Client(grpcUrl);
    const rate = await client.getReferenceData(
      pairInput !== ""
        ? pairInput.toUpperCase().replace(/\s/g, "").split(",")
        : pair.length > 0
        ? pair
        : defaultPair,
      minCount,
      askCount
    );
    // console.log(rate)
    setPrice(rate);
  }

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full md:w-4/12 mb-8 md:mb-0">
        <h2 className="mb-5 text-3xl ">
          <strong>Get Price</strong>
        </h2>
        <p className="mb-5">
          This section shows an example on how to query data from BandChain using{" "}
          <a
            href="https://docs.bandchain.org/client-library/bandchain.js/get-started.html#get-reference-data"
            target="_blank"
            rel="noreferrer"
          >
            <strong>getReferenceData</strong>
          </a>{" "}
          method. This example query standard price references based on given symbol pairs, min
          count, and ask count.
        </p>
      </div>
      <div className="w-full md:w-8/12 md:pl-10">
        <div className="card bg-white p-6 border-2 border-black rounded rounded-2xl w-full mb-10">
          <div className="card-inner">
            <div className="mb-5">
              <div className="input-group mb-3">
                <label
                  htmlFor="input-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Token Pair
                </label>
                <input
                  className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                  type="text"
                  id="input-address"
                  placeholder="e.g. BTC/USD,ETH/USD"
                  value={pairInput}
                  onChange={(e) => setPairInput(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <label
                  htmlFor="input-mincount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ask Count
                </label>
                <input
                  className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                  type="text"
                  id="input-address"
                  value={askCount}
                  onChange={(e) => setaskCount(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <label
                  htmlFor="input-mincount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Min Count
                </label>
                <input
                  className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-md"
                  type="text"
                  id="input-address"
                  value={minCount}
                  onChange={(e) => setminCount(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={getPrice}
              className="button block w-full text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-4 rounded-xl focus:outline-none"
            >
              Request
            </button>
          </div>
        </div>
        <h3 className="text-xl mb-8">
          <strong>Results</strong>
        </h3>
        <div className="flex flex-row gap-6 flex-wrap">
          {prices.map((price, ind) => (
            <CardPrice value={price} key={ind} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormGetPrice;
