import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";
import { SingleDelegator } from "../components/SingleDelegator";
import DelegatorDetails from "./DelegatorDetails";

export default function Delegations() {
  const wallet = useSelector((state) => state.wallet);
  useEffect(() => {
    getDelegators({ variables: { address: wallet.address } });
  }, []);

  const GET_DELEGATIONS = gql`
    query GetAccountDelegations($address: String!) {
      delegations_view(where: { delegator_address: { _eq: $address } }) {
        amount
        moniker
        reward
        operator_address
        delegator_address
      }
    }
  `;

  //   const { loading, error, data } = useQuery(GET_DELEGATIONS);
  const [getDelegators, { loading, error, data }] = useLazyQuery(GET_DELEGATIONS);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2 className="text-2xl mb-5">
                <strong>Delegations</strong>
              </h2>
              <div className="flex flex-wrap -mx-2">
                {loading
                  ? "Loading..."
                  : error
                  ? `Error! ${error.message}`
                  : data
                  ? data.delegations_view.map((delegator, ind) => {
                      return <SingleDelegator delegator={delegator} key={ind} />;
                    })
                  : "0 Validator"}
              </div>
            </div>
          }
        />
        <Route path=":operator" element={<DelegatorDetails />} />
      </Routes>
    </div>
  );
}
