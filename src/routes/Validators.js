import { gql, useQuery } from "@apollo/client";
import { SingleValidator } from "../components/SingleValidator";

export default function Validators() {
  const GET_VALIDATORS = gql`
    query GetValidators {
      validators {
        account {
          address
        }
        commission_rate
        operator_address
        moniker
        status
        tokens
        jailed
        website
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_VALIDATORS);
  return (
    <div className="flex flex-wrap -mx-2">
      {loading
        ? "Loading..."
        : error
        ? `Error! ${error.message}`
        : data
        ? data.validators.map((validator, ind) => {
            return <SingleValidator validator={validator} key={ind} />;
          })
        : "0 Validator"}
    </div>
  );
}
