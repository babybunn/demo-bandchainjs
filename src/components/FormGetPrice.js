
import { useEffect, useState } from 'react';
import { Client } from '@bandprotocol/bandchain.js';

function FormGetPrice() {

  // states
  const [prices, setPrice] = useState([]);
  const [pairInput, setPairInput] = useState("");
  const [pairs, setPairs] = useState([]);

  const handlePairInput = e => {
    if( !e.target.value ) return
    setPairInput( e.target.value )
    console.log(e.target.value.split(','))
    setPairs( e.target.value.split(',') )
  }

  async function getPrice() {
    // console.log(pairs)
    const grpcUrl = 'https://laozi-testnet4.bandchain.org/grpc-web';
    const client = new Client(grpcUrl);
    // const pairs = ["BTC/USDT", "ETH/USDT"]
    const minCount = 3
    const askCount = 4
    const rate = await client.getReferenceData(pairs, minCount, askCount);
    // console.log(rate)
    setPrice(rate);
  }
    return (
        <div className="container mx-auto max-w-md mt-10">
          <div className="card bg-white p-6 rounded rounded-2xl shadow-indigo shadow-lg">
            <h2 className="mb-5 text-xl"><strong>Get Price</strong></h2>
            <div className="card-inner">
            <div className="mb-5">
            <div className="input-group mb-3">
              <label htmlFor="input-address" className="block text-sm font-medium text-gray-700 mb-1">Pair (Separate with comma (,))</label>
              <input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-address" placeholder="e.g. BTC/USD,ETH/USD" value={pairInput} onChange={handlePairInput}/>
            </div>
            </div>
            <button onClick={getPrice} className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out">Get Price</button>
            </div>
            <ul className="price-list mt-4">
              {
                prices.map( (price,ind) => <li key={ind}><strong>{price.pair}: </strong>{price.rate}</li>)
              }
            </ul>
          </div>
        </div>
      );
}

export default FormGetPrice;