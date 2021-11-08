import { makeRequest } from '../band';

function FormSendRequest() {
  const sendRequest = async () => {
    const requestID = await makeRequest();
    console.log(requestID)
  }

    return (
        <div className="container mx-auto max-w-md mt-10">
          <button onClick={sendRequest} className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out">Send a Request</button>
        </div>
      );
}

export default FormSendRequest;