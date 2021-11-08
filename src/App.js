import './App.css';
import { useEffect, useState } from 'react';
import { Client } from '@bandprotocol/bandchain.js';
import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import SendToken from './routes/SendToken';
import SendRequest from './routes/SendRequest';

async function getPrice(setPrice) {
  const grpcUrl = 'https://laozi-testnet4.bandchain.org/grpc-web';
  const client = new Client(grpcUrl);
  const pairs = ["BTC/USDT", "ETH/USDT"]
  const rate = await client.getReferenceData(pairs);
  setPrice(rate);
}

function App() {
  
  // states
  const [prices, setPrice] = useState([]);
  
  
  // useEffect(() => {
    //   getPrice(setPrice);
    // }, []);
    
    return (
      <BrowserRouter>
        <div className="App pt-10">
          <div className="container mx-auto max-w-md">
            <h1 className="text-2xl text-center mb-4"><strong>BandChain.js Demo</strong></h1>
            <ul className="price-list">
              {
                prices.map( (price,ind) => <li key={ind}><strong>{price.pair}: </strong>{price.rate}</li>)
              }
            </ul>
            <div className="text-center">
              <nav>
                <Link to="/" className="bg-none text-indigo p-0 mr-4 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Get Price
                </Link>
                <Link to="/request" className="bg-none text-indigo p-0 mr-4 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Create a Request
                </Link>
                <Link to="/sendToken" className="bg-none text-indigo p-0 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Send Token
                </Link>
              </nav>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<SendToken />} />
            <Route path="/sendToken" element={<SendToken />} />
            <Route path="/request" element={<SendRequest />} />
          </Routes>
        </div>
        </BrowserRouter>
      );
}

export default App;
