import './App.css';

import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import SendToken from './routes/SendToken';
import SendRequest from './routes/SendRequest';
import GetPrice from './routes/GetPrice';
import Delegate from './routes/Delegate';
import IBCTransfer from './routes/IBCTransfer';

function App() {
    return (
      <BrowserRouter>
        <div className="App pt-10">
          <div className="container mx-auto max-w-lg">
            <h1 className="text-2xl text-center mb-4"><strong>BandChain.js Demo</strong></h1>
            <div className="text-center">
              <nav>
                <Link to="/getprice" className="bg-none text-indigo p-0 mr-4 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Get Price
                </Link>
                <Link to="/request" className="bg-none text-indigo p-0 mr-4 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Create a Request
                </Link>
                <Link to="/sendToken" className="bg-none text-indigo p-0 mr-4 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Send Token
                </Link>
                <Link to="/delegate" className="bg-none text-indigo p-0 mr-4 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  Delegate
                </Link>
                <Link to="/transfer" className="bg-none text-indigo p-0 rounded-md hover:none focus:outline-none transition duration-500 ease-in-out">
                  IBC Transfer
                </Link>
              </nav>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<SendToken />} />
            <Route path="/sendToken" element={<SendToken />} />
            <Route path="/request" element={<SendRequest />} />
            <Route path="/getprice" element={<GetPrice />} />
            <Route path="/delegate" element={<Delegate />} />
            <Route path="/transfer" element={<IBCTransfer />} />
          </Routes>
        </div>
        </BrowserRouter>
      );
}

export default App;
