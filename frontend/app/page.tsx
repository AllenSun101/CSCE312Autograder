'use client'

import axios from 'axios'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';


export default function Home() {

	const [files, setFiles] = useState([]);
	const [isPopupOpen, setPopupOpen] = useState(false);

	const [tests, setTests] = useState([]);

	const [globalError, setGlobalError] = useState(false);
	const [globalErrorMessage, setGlobalErrorMessage] = useState("");

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
		mutation.mutate({ files: files }, {
			onSuccess: (data) => {
				// check for global error and don't render results
				if (data.data[0]["Global Error"]) {
					setGlobalError(true);
					setGlobalErrorMessage(data.data[0]["Global Error"]);
				}
				else {
					setGlobalError(false);
					setTests(data.data);
				}
				setFiles([]);
			}
		})
	}

	// send request to backend and fetch data
	const mutation = useMutation({
		mutationFn: (params: any) => {
			return axios.post(`http://localhost:5000/`, params, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
	})


	// calculate passed test cases
	function passedCases() {
		var count = 0;
		tests.forEach((item: any) => {
			if (item.Expected !== undefined && item.Output !== undefined && item.Expected === item.Output) {
				count++;
			}
		});
		return count;
	}


	return (
		<div>
			<div className="flex h-[90vh] b-white">
				<div className="flex-1 flex flex-col overflow-hidden">
					<div className="flex h-full">


						<main className="flex flex-col w-full bg-white overflow-x-hidden overflow-y-auto">
							<p className='pt-8 px-8 text-lg font-semibold leading-snug'>Results</p>
							<div className="flex w-full mx-auto px-8 py-8">
								<div className="flex flex-col w-full h-full border-2">
									{mutation.status === 'pending' &&
										<div>
											<p className='text-center text-2xl py-24'>Autograder is running tests...</p>
											<p className='text-center text-xl pb-12'>Autograder go brrrrrrrr</p>
										</div>
									}
									{mutation.status === 'success' &&
										<div>
											{globalError ? <p className='text-2xl text-center py-24'> Error: {globalErrorMessage} </p> : <div>
												{tests.map((item: any, index: any) => (
													<div key={index} className="mx-6 py-6 border-b">
														<div className='mb-4'>
															<span className='text-lg'> Test {index + 1}: </span>{item.Expected !== undefined && item.Output !== undefined && item.Expected === item.Output ? <span className='text-lg mb-4 text-green-700'> PASS</span> : <span className='text-lg mb-4 text-red-700'> FAIL </span>}
														</div>
														{Object.keys(item)
															.sort((a, b) => {
																if (a.includes("Input") && !b.includes("Input")) return -1;
																if (b.includes("Input") && !a.includes("Input")) return 1;
																if (a === "Expected" && b !== "Output") return -1;
																if (b === "Expected" && a !== "Output") return 1;
																if (a === "Output" && b !== "Expected") return -1;
																if (b === "Output" && a !== "Expected") return 1;
																return 0;
															})
															.map((key) => (
																<p key={key} className='mx-6'>
																	{key}: {item[key]}
																</p>
															))}
													</div>
												))}

											</div>

											}

										</div>

									}
								</div>
							</div>
						</main>


						<div className="overflow-y-auto relative flex flex-col bg-clip-border bg-gray-100 h-[100vh] w-full max-w-[25rem] p-4 shadow-xl shadow-blue-gray-900/5">

							<div className="mb-2 p-4">
								<h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">Autograder Results</h5>
							</div>
							<nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
								<p className='mt-6'>Autograder Score:</p>
								<div>
									{
										globalError ? <p>Error</p> : <div>
											<p className='mb-6'>{passedCases()} / {tests.length} cases passed.</p>
											{tests.map((item: any, index: any) => (
												<div key={index} className="">
													{item.Expected !== undefined && item.Output !== undefined && item.Expected === item.Output ? <p className='text-green-700'> Test {index + 1} : Pass</p> : <p className='text-red-700'>  Test {index + 1} : Fail </p>}
												</div>
											))}
										</div>
									}
								</div>
							</nav>
						</div>


					</div>
				</div>
			</div>


			<div className="bg-gray-100 flex items-center justify-end py-5">
				<p className='px-4'>Submit all .hdl/.asm files and dependencies, the .tst file, and the .cmp file.</p>
				<button className="rounded-md bg-black text-white font-bold py-2 px-4 mx-6" onClick={openPopup}>Submit Files</button>
			</div>


			{isPopupOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
					<div className="bg-white p-8 rounded max-w-lg">
						<button onClick={closePopup} className="float-right text-gray-700 hover:text-gray-900">
							&times;
						</button>
						<p className='mb-6'>Include the required .hdl/.asm files and all dependencies, as well as the .tst and .cmp files.</p>
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