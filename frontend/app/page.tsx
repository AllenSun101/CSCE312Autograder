'use client'

import axios from 'axios'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';


export default function Home() {

	const [files, setFiles] = useState([]);
	const [isPopupOpen, setPopupOpen] = useState(false);

	const [tests, setTests] : any = useState("Hi");

	var passedCases = 5;
	var totalCases = 10;

	const handleFileChange = (event: any) => {
		const files: any = Array.from(event.target.files);
		setFiles(files);
	};

	const openPopup = (event: any) => {
		setPopupOpen(true);
	};

	const closePopup = (event: any) => {
		setPopupOpen(false);
		setFiles([]);
	};

	const submitPopup = (event: any) => {		
		setPopupOpen(false);
		// send files and fetch results
		// mutation.mutate({ files: files });
		mutation.mutate({course: "LOL"}, {
			onSuccess: (data) => {
				setTests(data.data);
			}
		})
		setFiles([]);
	}
	

	const mutation = useMutation({
		mutationFn: (params: any) => {
			return axios.get(`http://localhost:5000/Search_Fetch/${params.course}`);
		},
	})


	return (
		<div>
			<div className="flex h-[90vh] b-white">
				<div className="flex-1 flex flex-col overflow-hidden">
					<div className="flex h-full">
						<main className="flex flex-col w-full bg-white overflow-x-hidden overflow-y-auto">
							<p className='pt-8 px-8 text-lg font-semibold leading-snug'>Results</p>
							<div className="flex w-full mx-auto px-8 py-8">
								<div className="flex flex-col w-full h-full border-2">
									{mutation.status === 'pending' && <p className='text-center text-lg'>Autograder is running tests...</p>}
									{mutation.status === 'success' && <p>Yipee... : {tests}</p>}
									{mutation.status === 'error' && <p>{mutation.error.message}</p>}
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-4'>Test 1: FAIL</p>
										<p className='mx-6'>Input 1: 1</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-4'>Test 1: FAIL</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-4'>Test 1: FAIL</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-4'>Test 1: FAIL</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-1'>Test 1:</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-1'>Test 1:</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
									<div className="mx-6 py-6 border-b">
										<p className='text-lg mb-1'>Test 1:</p>
										<p className='mx-6'>Expected Output: 1</p>
										<p className='mx-6'>Output: 0</p>
									</div>
								</div>
							</div>
						</main>
						<div className="overflow-y-auto relative flex flex-col bg-clip-border bg-gray-100 h-[100vh] w-full max-w-[25rem] p-4 shadow-xl shadow-blue-gray-900/5">

							<div className="mb-2 p-4">
								<h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">Autograder Results</h5>
							</div>
							<nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
								<p className='mt-6'>Autograder Score:</p>
								<p className='mb-6'>{passedCases} / {totalCases} cases passed.</p>
								<p className='text-green-700'>Test 1: Pass</p>
								<p className='text-red-700'>Test 2: Fail</p>
								<p>Test 3: Pass</p>
								<p>Test 4: Pass</p>
								<p>Test 5: Pass</p>

							</nav>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-100 flex items-center justify-end py-5">
				<p className='px-4'>Submit all .hdl/.asm files and dependencies, and the .cmp file.</p>
				<button className="rounded-md bg-black text-white font-bold py-2 px-4 mx-6" onClick={openPopup}>Submit Files</button>
			</div>

			{isPopupOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
					<div className="bg-white p-8 rounded max-w-lg">
						<button onClick={closePopup} className="float-right text-gray-700 hover:text-gray-900">
							&times;
						</button>
						<p className='mb-6'>Include the required .hdl/.asm files and all dependencies, as well as the .cmp file.</p>
						<input
							onChange={handleFileChange}
							className='mb-6'
							type="file"
							multiple
						/>
						{files.length > 0 && (
							<div>
								<h2 className='font-bold'>Selected Files:</h2>
								<ul>
									{files.map((file: any, index) => (
										<li key={index}>{file.name}</li>
									))}
								</ul>
							</div>
						)}
						<button className='mt-2 bg-gray-100 py-2 px-4 rounded-md block mx-auto' onClick={submitPopup}>Submit Files</button>
					</div>
				</div>
			)}
		</div>
	)
}