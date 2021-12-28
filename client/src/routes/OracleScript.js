import { Link } from "react-router-dom";
export default function OracleScript() {
  return (
    <div className="container mx-auto max-w-full">
      <div className="card bg-white md:p-10 p-5 rounded-t-2xl mt-5">
        <div className="services mt-8 max-w-screen-md mx-auto">
          <ul className="services--list flex gap-6 flex-wrap items-stretch">
            <li className="services--list-item flex-grow w-1/5">
              <Link
                to="createos"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/oracle.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-xl font-bold">Create Oracle Script</h3>
              </Link>
            </li>
            <li className="services--list-item flex-grow w-1/5">
              <Link
                to="editos"
                className="h-full flex items-center flex-col justify-center border-4 border-solid border-gray-200 block p-5 hover:border-blue rounded-2xl text-center"
              >
                <img
                  src="/images/osedit.png"
                  className="block w-full h-auto"
                  style={{ maxWidth: "200px" }}
                  alt=""
                />
                <h3 className="text-xl font-bold">Edit Oracle Script</h3>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
