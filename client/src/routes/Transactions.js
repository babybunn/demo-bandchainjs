import { gql, useSubscription } from "@apollo/client";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
export default function Transactions() {
  const wallet = useSelector((state) => state.wallet);

  const GET_ACCOUNT_TRANSACTIONS_BY_PK = gql`
    subscription GetAccountTransactionByPK($address: String!) {
      accounts_by_pk(address: $address) {
        account_transactions(order_by: { transaction_id: desc }, limit: 10) {
          transaction {
            block_height
            err_msg
            gas_fee
            gas_limit
            hash
            gas_used
            id
            messages
            sender
            success
          }
        }
      }
    }
  `;

  const { loading, error, data } = useSubscription(GET_ACCOUNT_TRANSACTIONS_BY_PK, {
    variables: { address: wallet.address },
  });

  useEffect(() => {}, []);

  return (
    <div>
      <h1 className="text-2xl mb-5">
        <strong>My Transactions</strong>
      </h1>
      <div className="">
        {loading ? (
          "Loading..."
        ) : error ? (
          `Error! ${error.message}`
        ) : data ? (
          <div className="tx-table border-black border-2 rounded-xl">
            <div>
              <div className="row flex text-left">
                <th className="w-4/12 col p-2">Hash</th>
                <th className="col w-2/12 p-2">Block</th>
                <th className="col w-2/12 p-2">Status</th>
                <th className="w-4/12 col p-2">Actions</th>
              </div>
            </div>
            <tbody>
              {data.accounts_by_pk.account_transactions.map((tx, ind) => {
                return (
                  <div className="row flex">
                    <div className="p-2 w-4/12 overflow-hidden overflow-ellipsis">
                      <span>{tx.transaction.hash.replace("\\x", "")}</span>
                    </div>
                    <div className="p-2 w-2/12">{tx.transaction.block_height}</div>
                    <div className="p-2 w-2/12">
                      {tx.transaction.success ? (
                        <span className="text-green-400">Success</span>
                      ) : (
                        <span className="text-orange">Failed</span>
                      )}
                    </div>
                    <div className="p-2 w-4/12  overflow-hidden overflow-ellipsis">
                      {tx.transaction.messages.map((msg) => (
                        <span>{msg.type.split("1.")[1]}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </tbody>
          </div>
        ) : (
          "You haven't made any transaction in this account."
        )}
      </div>
    </div>
  );
}
