import AccountSidebar from "../components/AccountSidebar";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Validators from "./Validators";
import Delegations from "./Delegations";
import DelegatorDetails from "./DelegatorDetails";

export default function AccountPage() {
  return (
    <div className="container mx-auto max-w-full">
      <div className="md:flex gap-6">
        <AccountSidebar />
        <div className="card bg-white md:p-10 p-5 rounded-2xl mt-5 lg:w-3/4 w-full">
          <Routes>
            <Route path="validators" element={<Validators />} />
            <Route path="delegations" element={<Delegations />}>
              <Route path=":operator" element={<DelegatorDetails />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
