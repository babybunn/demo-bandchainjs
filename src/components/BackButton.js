import { Link } from "react-router-dom";

export default function BackButton() {
  return (
    <div className="mt-5">
      <Link to="/" className="text-xl font-bold text-black group inline-block">
        <div className="flex items-center">
          <div
            className="bg-white group-hover:bg-orange text-black back-icon flex items-center justify-center rounded-full border-2 border-solid border-black mr-2"
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          Back
        </div>
      </Link>
    </div>
  );
}
