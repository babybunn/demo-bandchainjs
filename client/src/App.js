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
import EditOracleScript from "./routes/EditOracleScript";
import Converter from "./routes/Converter";

const BackRoute = () => {
  const location = useLocation();
  if (location.pathname !== "/" && !location.pathname.includes("/myaccount")) {
    return <BackButton />;
  }
  return null;
};

function App() {
  const wallet = useSelector((state) => state.wallet);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <BrowserRouter>
      <div className="App md:p-6 p-3">
        <p>{!data ? "Loading..." : data}</p>
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
          <Route exact path="/oraclescript/createos" element={<CreateOracleScript />} />
          <Route exact path="/oraclescript/editos" element={<EditOracleScript />} />
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
          </Route>
        </Routes>
        <BackRoute />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
