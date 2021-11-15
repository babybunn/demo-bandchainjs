import { makeRequest } from '../band';
import { useState } from 'react';
import Loading from './Loading';

function FormSendRequest() {
  const [sendResultError, setSendResultError] = useState("")
  const [sendResult, setSendResult] = useState([])
  const [symbols, setSymbols] = useState("")
  const [loading,setLoading] = useState(Boolean(0))

  const handleInputSymbols = e => {
    if(e.target.value) setSymbols(e.target.value)
  }

  const sendRequest = async () => {
    setLoading(Boolean(1))
    const requestID = await makeRequest(symbols);
    // console.log(requestID)
    if( requestID.data === "") return setSendResultError(requestID.rawLog)

    if ( requestID.data !== "" ) {
      console.log(requestID)
      setSendResult(requestID.logsList[0].eventsList[2].attributesList)
      console.log(sendResult)
    }
    setLoading(Boolean(0))
  }

    return (
        <div className="container mx-auto max-w-md mt-10">
          <div className="card bg-white p-6 rounded rounded-2xl shadow-indigo shadow-lg">
            <h2 className="mb-5 text-xl"><strong>Create a new request</strong></h2>
            <div className="card-inner">
            <div className="mb-5">
            <div className="input-group mb-3">
              <label htmlFor="input-address" className="block text-sm font-medium text-gray-700 mb-1">Symbols ([string])</label>
              <input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-address" value={symbols} onChange={handleInputSymbols} />
            </div>
            </div>
            <button onClick={sendRequest} className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out">Send a Request</button>
            </div>
            {
              loading ? <Loading /> : ( sendResultError ? <div className="mt-5 text-red-500">{sendResultError}</div> : sendResult.map( (res,ind) => <div key={ind}> {res.key}: {res.value}</div>))
            }
          </div>
        </div>
      );
}

export default FormSendRequest;