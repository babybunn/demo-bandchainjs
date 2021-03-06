import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mx-auto max-w-full">
      <div className="card bg-white md:p-10 p-5 rounded-t-2xl mt-5">
        <h2 className="text-center text-xl md:text-4xl">
          <strong>Please choose a service</strong>
        </h2>
        <div className="services mt-8">
          <ul className="services--list flex gap-6 flex-wrap items-stretch">
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/getprice"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/getprice.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">Get Price</h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/sendToken"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/token.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">Transfer</h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/delegate"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/delegate.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">Delegate Token</h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/transfer"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/transfer.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">IBC Transfer</h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/request"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/request.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">
                  Make an
                  <br /> Oracle Request
                </h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/datasource"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/datasource.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">Data Source</h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow md:w-1/5 w-full">
              <Link
                to="/oraclescript"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/oracle.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-md xl:text-xl font-bold">Oracle Script</h3>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="card bg-white p-2 rounded-b-2xl"></div>
    </div>
  );
}

export default Home;
