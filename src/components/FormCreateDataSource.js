import { useEffect, useState } from 'react';
import { sendCoin } from '../band';

export default function FormCreateDataSource() {
	return (
		<div className="container mx-auto max-w-md mt-10">
			<div className="card bg-white p-6 rounded rounded-2xl shadow-indigo shadow-lg">
				<h2 className="mb-5 text-xl"><strong>Create Data Source</strong></h2>
				<div className="card-inner">
					<div className="mb-5">
						<div className="input-group mb-3">
							<label htmlFor="input-address" className="block text-sm font-medium text-gray-700 mb-1">Data Source Name</label>
							<input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-address" onChange={e => console.log(e.target.value)} />
						</div>
						<div className="input-group mb-3">
							<label htmlFor="input-sender" className="block text-sm font-medium text-gray-700 mb-1">Sender Address</label>
							<input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-sender" onChange={e => console.log(e.target.value)} />
						</div>
						<div className="input-group mb-3">
							<label htmlFor="input-owner" className="block text-sm font-medium text-gray-700 mb-1">Owner Address</label>
							<input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-owner" onChange={e => console.log(e.target.value)} />
						</div>
						<div className="input-group mb-3">
							<label htmlFor="input-treasury" className="block text-sm font-medium text-gray-700 mb-1">Treasury Address</label>
							<input className="focus:outline-none focus:ring-2 focus:ring-purple-600 block w-full p-2 sm:text-sm border-solid border border-gray-200 rounded-md" type="text" id="input-treasury" onChange={e => console.log(e.target.value)} />
						</div>
						<div>
							<label htmlFor="input-file" className="block text-sm font-medium text-gray-700 mb-1">Data Source File (.py format)</label>
							<input type="file" accept='text/x-python-script' id="input-file" />
						</div>
					</div>
					<button className="button block w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-purple-600 focus:ring-opacity-50 transition duration-500 ease-in-out">
						Add a new data source
					</button>
				</div>
			</div>
		</div>
	)
}