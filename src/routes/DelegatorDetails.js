import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { gql, useLazyQuery } from "@apollo/client";

export default function DelegatorDetails() {
  const wallet = useSelector((state) => state.wallet);
  let { operator } = useParams();
  const GET_VALIDATOR_DETAILS = gql`
    query GetValidatorDetails($address: String!, $operator: String!) {
      delegations_view(
        where: { delegator_address: { _eq: $address }, operator_address: { _eq: $operator } }
      ) {
        amount
        delegator_address
        identity
        moniker
        operator_address
        reward
      }
    }
  `;

  const [GetValidator, { loading, error, data }] = useLazyQuery(GET_VALIDATOR_DETAILS);

  useEffect(() => {
    GetValidator({ variables: { address: wallet.address, operator: operator } });
  }, []);

  return (
    <div>
      <div className="flex flex-wrap -mx-2">
        {loading
          ? "Loading..."
          : error
          ? `Error! ${error.message}`
          : data
          ? data.delegations_view.map((delegator, ind) => {
              return (
                <h1 className="text-2xl">
                  <strong>{delegator.moniker}</strong>
                </h1>
              );
            })
          : "0 Validator"}
      </div>
    </div>
  );
}
