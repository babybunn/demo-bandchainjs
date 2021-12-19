export function SingleValidator({ validator }) {
  return (
    <div className="px-2  w-4/12 ">
      <div className="card border-2 border-black rounded-xl p-5 my-2">
        <h3 className="mb-3">
          <strong>{validator.moniker}</strong>
        </h3>
        <p className="text-gray-500 text-xs mb-1">Voting Power</p>
        <h4 className="text-xl">4.0%</h4>
      </div>
    </div>
  );
}
