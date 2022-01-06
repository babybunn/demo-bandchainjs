import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { getPairPrice, withdrawReward } from "../band";
import ModalDelegate from "../components/ModalDelegate";
import { ModalDelegateContext } from "../app-context";
import ModalRedelegate from "../components/ModalRedelegate";
import ModalReinvest from "../components/ModalReinvest";

export default function DelegatorDetails() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalRedelegate, setIsShowModalRedelegate] = useState(false);
  const [isShowModalReinvest, setIsShowModalReInvest] = useState(false);
  const [delegateType, setDelegateType] = useState("");
  const [reinvestReward, setreinvestReward] = useState(0);
  // const [isShowModalDelegate, setIsShowModalDelegate] = useState(false);
  // const [isShowModalUndelegate, setIsShowModalUndelegate] = useState(false);

  const isModalDelegateActive = useMemo(() => ({ isShowModal, setIsShowModal }), [isShowModal]);
  const isModalRedelegateActive = useMemo(
    () => ({ isShowModalRedelegate, setIsShowModalRedelegate }),
    [isShowModalRedelegate]
  );
  const isModalReinvestActive = useMemo(
    () => ({ isShowModalReinvest, setIsShowModalReInvest }),
    [isShowModalReinvest]
  );

  // const isModalDelegateActive = useMemo(
  //   () => ({ isShowModalDelegate, setIsShowModalDelegate }),
  //   [isShowModalDelegate]
  // );
  // const isModalUndelegateActive = useMemo(
  //   () => ({ isShowModalUndelegate, setIsShowModalUndelegate }),
  //   [isShowModalUndelegate]
  // );

  const wallet = useSelector((state) => state.wallet);
  let { operator } = useParams();

  // states
  const [usdPrice, setUsdPrice] = useState([]);

  async function getPrice() {
    const response = await getPairPrice(["BAND/USD"], 10, 16);
    if (response) setUsdPrice(response[0].rate);
  }

  // const GET_DELEGATIONS = gql`
  //   subscription GetAccountDelegations($address: String!) {
  //     delegations_view(
  //       where: { delegator_address: { _eq: $address } }
  //       order_by: { moniker: asc }
  //     ) {
  //       amount
  //       moniker
  //       reward
  //       operator_address
  //       delegator_address
  //     }
  //   }
  // `;

  const GET_VALIDATOR_DETAILS = gql`
    query GetValidatorDetails($address: String!, $operator: String!) {
      delegations_view(
        where: { delegator_address: { _eq: $address }, operator_address: { _eq: $operator } }
      ) {
        amount
        delegator_address
        moniker
        operator_address
        reward
      }
      validators(where: { operator_address: { _eq: $operator } }) {
        tokens
        commission_rate
        validator_report_count {
          count
        }
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

  // const { loading, error, data } = useQuery(GET_DELEGATIONS);
  // const [GetValidator, { loading, error, data }] = useSubscription(GET_VALIDATOR_DETAILS);
  //
  const [GetValidator, { loading, error, data }] = useLazyQuery(GET_VALIDATOR_DETAILS);

  // const [getDelegationSub, { loading, error, data }] = useSubscription(GET_DELEGATIONS, {
  //   variables: { address: wallet.address },
  // });

  // const { amount, moniker, delegator_address, operator_address, reward, share_percentage } = data.delegations_view

  const openModalDelegate = (modalType) => {
    // if (delegateType === "delegate") setIsShowModalDelegate(true);
    // if (delegateType === "undelegate") setIsShowModalUndelegate(true);
    setIsShowModal(true);
    setDelegateType(modalType);
  };

  const openModalRedelegate = () => {
    // if (delegateType === "delegate") setIsShowModalDelegate(true);
    // if (delegateType === "undelegate") setIsShowModalUndelegate(true);
    setIsShowModalRedelegate(true);
  };

  const openModalReInvest = (reward) => {
    setreinvestReward(reward);
    // if (delegateType === "delegate") setIsShowModalDelegate(true);
    // if (delegateType === "undelegate") setIsShowModalUndelegate(true);
    setIsShowModalReInvest(true);
  };

  const claim = async () => {
    const response = await withdrawReward(
      wallet.address,
      operator,
      wallet.address,
      wallet.pubkey,
      wallet.privateKey
    );
    console.log(response);
  };

  useEffect(() => {
    getPrice();
  }, []);

  useEffect(() => {
    GetValidator({ variables: { address: wallet.address, operator: operator } });
  }, [wallet, operator, GetValidator]);

  return (
    <div>
      <div className="flex flex-wrap -mx-2">
        {loading ? (
          "Loading..."
        ) : error ? (
          `Error! ${error.message}`
        ) : data ? (
          <>
            <h1 className="text-2xl mb-3">
              <strong>{data.delegations_view[0].moniker}</strong>
            </h1>
            <div className="flex w-full gap-3 flex-wrap mt-3">
              <div className="border-2 border-black rounded-xl p-5 flex-1 flex-grow bg-rose-400">
                <h3 className="mb-2 text-sm font-medium">Voting Power</h3>
                <h3 className="text-2xl text-right font-bold">
                  {(
                    (data.validators[0].tokens / data.validators_aggregate.aggregate.sum.tokens) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
              </div>
              <div className="border-2 border-black rounded-xl p-5 flex-1 flex-grow bg-indigo-400">
                <h3 className="mb-2 text-sm font-medium">Commission</h3>
                <h3 className="text-2xl text-right font-bold">
                  {(data.validators[0].commission_rate * 100).toFixed(2)}%
                </h3>
              </div>
              <div className="border-2 border-black rounded-xl p-5 flex-1 flex-grow bg-warmGray-400">
                <h3 className="mb-2 text-sm font-medium">Oracle Reports</h3>
                <h3 className="text-2xl text-right font-bold">
                  {data.validators[0].validator_report_count.count}
                </h3>
              </div>
            </div>
            <div className="mt-8 block w-full">
              <h2 className="text-xl mb-3">
                <strong>Your Delegation</strong>
              </h2>
              <div className="flex w-full gap-3 flex-wrap mt-3">
                <div className="border-2 border-black p-5 w-full block rounded-xl flex-1 flex-grow bg-yellow-300">
                  <h3 className="mb-4 text-xl font-bold">Assets</h3>
                  <h3 className="mb-2 text-sm font-medium">BAND Staked</h3>
                  <h4 className="text-2xl font-bold text-right">
                    {(data.delegations_view[0].amount / 1e6).toFixed(4)}
                  </h4>
                  <h4 className="mb-2 text-sm font-medium text-right text-orange">
                    ~{((data.delegations_view[0].amount / 1e6) * usdPrice).toFixed(4)} USD
                  </h4>
                  <div className="action-group flex gap-3 mt-4">
                    <button
                      onClick={() => openModalDelegate("delegate")}
                      className="flex-1 flex-grow button block ml-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none disabled:opacity-50 shadow-insetBlack hover:shadow-none"
                    >
                      Delegate
                    </button>
                    <button
                      onClick={() => openModalDelegate("undelegate")}
                      className="flex-1 flex-grow button block ml-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none disabled:opacity-50 shadow-insetBlack hover:shadow-none"
                    >
                      Undelegate
                    </button>
                    <button
                      onClick={openModalRedelegate}
                      className="flex-1 flex-grow button block ml-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none disabled:opacity-50 shadow-insetBlack hover:shadow-none"
                    >
                      Redelegate
                    </button>
                  </div>
                </div>
                <div className="border-2 border-black p-5 w-full block rounded-xl flex-1 flex-grow bg-teal-400">
                  <h3 className="mb-3 text-xl font-bold">Rewards</h3>
                  <h3 className="mb-2 text-sm font-medium">Unclaim Rewards (BAND)</h3>
                  <h4 className="text-2xl font-bold text-right">
                    {(data.delegations_view[0].reward / 1e6).toFixed(4)}
                  </h4>
                  <h4 className="mb-2 text-sm font-medium text-right text-orange">
                    ~{((data.delegations_view[0].reward / 1e6) * usdPrice).toFixed(4)} USD
                  </h4>
                  <div className="action-group flex gap-3 mt-4">
                    <button
                      onClick={() => openModalReInvest(data.delegations_view[0].reward / 1e6)}
                      className="flex-1 flex-grow button block ml-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none disabled:opacity-50 shadow-insetBlack hover:shadow-none"
                    >
                      Reinvest
                    </button>
                    <button
                      onClick={claim}
                      className="flex-1 flex-grow button block ml-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none disabled:opacity-50 shadow-insetBlack hover:shadow-none"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          "0 Validator"
        )}
      </div>
      <ModalDelegateContext.Provider value={isModalDelegateActive}>
        <ModalDelegate operator={operator} title={delegateType} />
      </ModalDelegateContext.Provider>
      <ModalDelegateContext.Provider value={isModalRedelegateActive}>
        <ModalRedelegate operator={operator} title={delegateType} />
      </ModalDelegateContext.Provider>
      <ModalDelegateContext.Provider value={isModalReinvestActive}>
        <ModalReinvest operator={operator} rewardAmount={reinvestReward} />
      </ModalDelegateContext.Provider>
    </div>
  );
}
