import { Link } from "react-router-dom";
export function SingleDelegator({ delegator }) {
  return (
    <div className="px-2 w-full lg:w-4/12 mb-5 block">
      <div className="card border-2 border-black rounded-xl p-5 h-full">
        <h3 className="mb-3">
          <Link to={delegator.operator_address} className="hover:text-blue">
            <strong>{delegator.moniker}</strong>
          </Link>
        </h3>
        <div className="flex -mx-3 flex-wrap ">
          <div className="px-3 w-1/2">
            <p className="text-xs text-gray-500 mb-1">Staked (BAND)</p>
            <p className="text-md text-black font-bold">{(delegator.amount / 1e6).toFixed(4)}</p>
          </div>
          <div className="border-l border-gray-200  px-3 :w-1/2">
            <p className="text-xs text-gray-500 mb-1">Rewards (BAND)</p>
            <p className="text-md text-black font-bold">{(delegator.reward / 1e6).toFixed(4)}</p>
          </div>
        </div>
        <button className="button px-4 py-2 w-full bg-yellow-400 border-2 border-b-4 border-black rounded-xl mt-4 hover:border-b-2 hover:bg-yellow-500">
          Claim
        </button>
      </div>
    </div>
  );
}
