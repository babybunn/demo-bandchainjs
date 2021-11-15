import { useState } from "react";
import {sendCoin} from "../band";
import Loading from './Loading';

function FormDelegate() {
    const [validator, setValidator] = useState("bandvaloper1zkf9qzs7ayf3uqksxqwve8q693dsdhxk800wvw")
    const [amount, setAmount] = useState("")
    const [sendResult, setSendResult] = useState("")
    const [sendResultSuccess, setSendResultSuccess] = useState("")
    const [loading, setLoading] = useState(Boolean(0));

    const handleInputValidator = e => {
        if( e.target.value ) setValidator( e.target.value )
    }

    const handleInputAmount = e => {
        if( e.target.value ) setAmount( e.target.value )
    }

    const sendBandToken = async () => {
        if ( !validator && !amount) return
        setLoading(Boolean(1))
        const response = await sendCoin(validator, amount, 'delegate');
        if( response.data === "") setSendResult(response.rawLog)
        if( response.data !== "") setSendResultSuccess(response.txhash)
        setLoading(Boolean(0))
    }

    return (
        <div className="container mx-auto max-w-md mt-10">
        <div className="card bg-white p-6 rounded rounded-2xl shadow-indigo shadow-lg">
          <h2 className="mb-5 text-xl"><strong>Delegate Token</strong></h2>
          <div className="card-inner">
          <div className="mb-5">
          <div className="input-group mb-3">
            <label htmlFor="input-address" className="block text-sm font-medium text-gray-700 mb-1">Delegate to</label>
            <input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-address" onChange={handleInputValidator} value={validator} />
          </div>
          <div className="input-group mb-3">
            <label htmlFor="input-amount" className="block text-sm font-medium text-gray-700 mb-1">Token Amount (BAND)</label>
            <input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="number" min="0" id="input-amount" onChange={handleInputAmount} value={amount} />
          </div>
          </div>
          <button onClick={sendBandToken} className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out">
          Delegate
        </button>
          </div>
          {
              loading ? <Loading/> : ( sendResult ? <div className="mt-5 text-red-500">{sendResult}</div> : sendResultSuccess ? <div className="mt-3 whitespace-nowrap overflow-ellipsis overflow-hidden">Transaction: <a className="text-indigo-500" href={`https://laozi-testnet4.cosmoscan.io/tx/${sendResultSuccess}`}>{sendResultSuccess}</a></div> : '' )
          }
        </div>
        </div>
    )
}

export default FormDelegate;