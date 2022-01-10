import "./App.css";
import { React, useState, useEffect } from "react";
import { Link, BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// components
import Home from "./components/Home";
import Navbar from "./components/Header/Navbar";
import BackButton from "./components/BackButton";
import Footer from "./components/Footer";

// routes
import GetPrice from "./routes/GetPrice";
import Delegate from "./routes/Delegate";
import SendToken from "./routes/SendToken";
import SendRequest from "./routes/SendRequest";
import IBCTransfer from "./routes/IBCTransfer";
import DataSource from "./routes/DataSource";
import OracleScript from "./routes/OracleScript";
import AccountPage from "./routes/AccountPage";
import Validators from "./routes/Validators";
import Delegations from "./routes/Delegations";
import DelegatorDetails from "./routes/DelegatorDetails";
import CreateOracleScript from "./routes/CreateOracleScript";
import Converter from "./routes/Converter";
import Transactions from "./routes/Transactions";

const BackRoute = () => {
  const location = useLocation();
  if (location.pathname !== "/" && !location.pathname.includes("/myaccount")) {
    return <BackButton />;
  }
  return null;
};

function App() {
  const wallet = useSelector((state) => state.wallet);
  const [code, setCode] = useState(null);

  useEffect(() => {
    // fetch("/compile")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setCode(data.message);
    //     if (code) console.log(code);
    //   });
  }, []);

  return (
    <BrowserRouter>
      <div className="App md:p-6 p-3">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/sendToken" element={<SendToken />} />
          <Route exact path="/request" element={<SendRequest />} />
          <Route exact path="/getprice" element={<GetPrice />} />
          <Route exact path="/delegate" element={<Delegate />} />
          <Route exact path="/transfer" element={<IBCTransfer />} />
          <Route exact path="/datasource" element={<DataSource />} />
          <Route exact path="/oraclescript" element={<OracleScript />} />
          <Route exact path="/oraclescript/create" element={<CreateOracleScript />} />
          <Route exact path="/oraclescript/edit" element={<CreateOracleScript />} />
          <Route
            exact
            path="/myaccount"
            element={wallet.address ? <AccountPage /> : <Navigate to="/" />}
          >
            <Route path="validators" element={<Validators />} />
            <Route path="delegations" element={<Delegations />}>
              <Route path=":operator" element={<DelegatorDetails />} />
            </Route>
            <Route path="converter" element={<Converter />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Routes>
        <BackRoute />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
