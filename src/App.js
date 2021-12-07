import "./App.css";
import { React, useState, useEffect } from "react";
import { Link, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import SendToken from "./routes/SendToken";
import SendRequest from "./routes/SendRequest";
import GetPrice from "./routes/GetPrice";
import Delegate from "./routes/Delegate";
import IBCTransfer from "./routes/IBCTransfer";
import DataSource from "./routes/DataSource";
import Home from "./components/Home";
import Navbar from "./components/Header/Navbar";
import BackButton from "./components/BackButton";

const BackRoute = () => {
  const location = useLocation();
  if (location.pathname !== "/") {
    return <BackButton />;
  }
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App p-6">
        <Navbar />
        <div className="container mx-auto max-w-full">
          <div className="card bg-white p-10 rounded-2xl mt-5">
            <BackRoute />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sendToken" element={<SendToken />} />
              <Route path="/request" element={<SendRequest />} />
              <Route path="/getprice" element={<GetPrice />} />
              <Route path="/delegate" element={<Delegate />} />
              <Route path="/transfer" element={<IBCTransfer />} />
              <Route path="/datasource" element={<DataSource />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
