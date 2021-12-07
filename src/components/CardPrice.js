export default function CardPrice({ value }) {
  const orgPair = value.pair;
  const symbol = orgPair.split("/")[0].toLowerCase();
  return (
    <div className="card bg-yellow-50 relative p-3 border-2 border-black rounded-xl w-full md:w-2/6 lg:w-1/6 cursor-pointer hover:bg-yellow-100">
      <div className="coin-symbol w-6 h-6 overflow-hidden bg-white rounded-full flex justify-center items-center text-black">
        <img
          src={`https://data.bandprotocol.com/tokens/${symbol}.png`}
          alt=""
          className="object-cover block w-full h-full"
        />
      </div>
      <h3 className="text-lg mb-5 font-bold mt-3">{value.pair}</h3>
      <h3 className="text-lg font-medium text-blue">
        {new Intl.NumberFormat("en-TH", { style: "currency", currency: "USD" }).format(value.rate)}
      </h3>
    </div>
  );
}
