import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { SingleValidator } from "../components/SingleValidator";

export default function Validators() {
  const GET_VALIDATORS = gql`
    query GetValidators {
      validators {
        moniker
        operator_address
        tokens
        commission_rate
        commission_max_change
        commission_max_rate
      }
      validators_aggregate {
        aggregate {
          sum {
            tokens
          }
        }
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
            return (
              <SingleValidator
                validator={validator}
                key={ind}
                totalBonded={
                  data.validators_aggregate ? data.validators_aggregate.aggregate.sum.tokens : 0
                }
              />
            );
          })
        : "0 Validator"}
    </div>
  );
}
