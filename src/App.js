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
import Footer from "./components/Footer";

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
      <div className="App md:p-6 p-3">
        <Navbar />
        <div className="container mx-auto max-w-full">
          <div className="card bg-white md:p-10 p-5 rounded-2xl mt-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sendToken" element={<SendToken />} />
              <Route path="/request" element={<SendRequest />} />
              <Route path="/getprice" element={<GetPrice />} />
              <Route path="/delegate" element={<Delegate />} />
              <Route path="/transfer" element={<IBCTransfer />} />
              <Route path="/datasource" element={<DataSource />} />
            </Routes>
            <BackRoute />
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
