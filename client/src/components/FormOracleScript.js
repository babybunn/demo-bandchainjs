import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { createOracleScript, editOracleScript } from "../band";
import { useSelector } from "react-redux";
import UnableService from "./UnableService";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import Loading from "./Loading";

export default function FormOracleScript() {
  const wallet = useSelector((state) => state.wallet);

  // State
  const [isConnected, setisConnected] = useState(false);
  const [step, setStep] = useState(1);
  const [codeType, setCodeType] = useState("upload");
  const [previewJson, setPreviewJson] = useState("");
  const [txhash, settxhash] = useState("");
  const [isbroadcasting, setisbroadcasting] = useState(false);

  // Form Data
  const [osID, setOsId] = useState("");
  const [osname, setosname] = useState("");
  const [osdesc, setosdesc] = useState("");
  const [schema, setschema] = useState("");
  const [sourcecodeUrl, setsourcecodeUrl] = useState("");
  const [owner, setOwner] = useState("");
  const [code, setCode] = useState([]);
  const [filename, setfilename] = useState("");
  const [codeEditor, setCodeEditor] = useState(`# Insert your code here`);
  const [wasmCode, setwasmCode] = useState(null);
  const [osActionType, setOsActionType] = useState("create");

  const location = useLocation();

  // Handling Functions
  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isFormFilled = () => {
    if (osname !== "" && owner !== "") {
      return false;
    }
    return true;
  };

  const removeFile = () => {
    setCode([]);
    setfilename("");
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setfilename(acceptedFiles[0].name);
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          setCode(binaryStr);
        };
        reader.readAsArrayBuffer(file);
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: "text/x-wasm",
  });

  const renderSwitchCode = () => {
    switch (codeType) {
      case "editor":
        return (
          <Editor
            value={codeEditor}
            onValueChange={(rawcode) => setCodeEditor(rawcode)}
            highlight={(rawcode) => highlight(rawcode, languages.rust)}
            padding={15}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              background: "#282A2B",
              color: "white",
              borderRadius: "10px",
              minHeight: "300px",
            }}
          />
        );
      default:
        return (
          <div className="input-group mb-3">
            {code.byteLength > 0 ? (
              <div
                onClick={removeFile}
                className="group cursor-pointer border-l-2 border-t-2 border-r-4 border-b-4 hover:border-r-2 hover:border-b-2  hover:border-orange hover:bg-red-100 border-black bg-yellow-50 p-3 text-black rounded-xl relative w-full hover:transform hover:translate-x-px hover:translate-y-px"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="/images/python-file.png"
                      alt=""
                      className="w-100 block h-auto mr-4"
                      style={{ maxWidth: "50px" }}
                    />
                    <p className="font-medium">{filename}</p>
                  </div>
                  <div className="invisible group-hover:visible btn-deletefile w-8 h-8 bg-orange rounded-full text-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="upload-outer" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="h-40 border-2 bg-gray-50 border-gray-300 rounded-xl text-center flex items-center justify-center">
                  <div>
                    Drag 'n' drop a file here,
                    <br /> or <br />
                    <span className="mt-2 cursor-pointer inline-block button px-4 py-1 border-2 border-black rounded-xl bg-yellow-300 hover:bg-yellow-400 text-sm">
                      Browse
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const compileCode = async () => {
    setStep(step + 1);
    if (codeType !== "upload") {
      await axios
        .post(`/compile`, {
          code: codeEditor,
        })
        .then((res) => {
          setwasmCode(res.data.fileBuf);
        });
    }
    setPreviewJson(
      JSON.stringify({
        name: osname,
        description: osdesc,
        schema: schema,
        source_code_url: sourcecodeUrl,
        owner: owner,
        sender: wallet.address,
      })
    );
  };

  const submitCode = async () => {
    setisbroadcasting(true);
    setStep(step + 1);
    const response =
      osActionType === "create"
        ? await createOracleScript(
            {
              name: osname,
              desc: osdesc,
              schema: schema,
              url: sourcecodeUrl,
              code: codeType === "upload" ? Buffer.from(code) : Buffer.from(wasmCode),
              owner: owner,
            },
            wallet
          )
        : await editOracleScript(
            {
              id: osID,
              name: osname,
              desc: osdesc,
              schema: schema,
              url: sourcecodeUrl,
              code: codeType === "upload" ? Buffer.from(code) : Buffer.from(wasmCode),
              owner: owner,
            },
            wallet
          );
    if (response.code === 0) {
      settxhash(response.txhash);
      setisbroadcasting(false);
    } else {
      setisbroadcasting(false);
      console.log(response);
    }
    // Todo: Show loading state and the result of the tx and show the next step
  };

  // Effects
  useEffect(() => {
    if (wallet.address) {
      setisConnected(true);
    } else {
      setisConnected(false);
    }
    if (location.pathname.includes("/edit")) {
      setOsActionType("edit");
    }
  }, [wallet]);

  return (
    <div className="flex flex-row flex-wrap">
      <div className="w-full md:w-4/12 mb-8 md:mb-0">
        <h2 className="mb-5 text-3xl ">
          <strong>{osActionType === "edit" ? `Edit an ` : `Add a new `} Oracle Script</strong>
        </h2>
        <p className="mb-5">
          <a
            href="https://docs.bandchain.org/client-library/bandchain.js/get-started.html#send-band-token"
            target="_blank"
            rel="noreferrer"
          >
            <strong>
              {osActionType === "edit" ? `MsgEditOracleScript` : `MsgCreateOracleScript`}{" "}
            </strong>
          </a>{" "}
          is a message for this service
        </p>
        <div className="process-step">
          <ul>
            <li className="mb-5">
              <strong>Step 1:</strong> Provide the oracle script information such as name, schema,
              owner address, and description.
            </li>
            <li className="mb-5">
              <strong>Step 2:</strong> Upload the .rust file or try using code editor
            </li>
            <li className="mb-5">
              <strong>Step 3:</strong> Review and deploy your oracle script and Finish.
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full md:w-8/12 md:pl-10">
        {!isConnected ? (
          <UnableService />
        ) : (
          <div>
            <div className="card bg-white border-2 border-black rounded rounded-2xl w-full mb-10">
              <div className="card-inner p-6">
                {step === 1 ? (
                  <div className="form-container mb-5 step step-1">
                    <div className="form-wrapper mb-6">
                      <h3 className="mb-4">
                        <strong>Step 1:</strong> Enter the oracle script information below.
                      </h3>
                      {osActionType === "edit" ? (
                        <div className="input-group mb-3">
                          <label
                            htmlFor="input-address"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Oracle Script ID <span className="text-orange">*</span>
                          </label>
                          <input
                            className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                            type="text"
                            id="input-address"
                            onChange={(e) => setOsId(e.target.value)}
                            value={osID}
                          />
                        </div>
                      ) : null}
                      <div className="input-group mb-3">
                        <label
                          htmlFor="input-address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Oracle Script Name <span className="text-orange">*</span>
                        </label>
                        <input
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          type="text"
                          id="input-address"
                          onChange={(e) => setosname(e.target.value)}
                          value={osname}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <label
                          htmlFor="input-owner"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Owner Address <span className="text-orange">*</span>
                        </label>
                        <input
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          type="text"
                          id="input-owner"
                          value={owner}
                          onChange={(e) => setOwner(e.target.value)}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <label
                          htmlFor="input-treasury"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Schema
                        </label>
                        <input
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          type="text"
                          id="input-treasury"
                          value={schema}
                          onChange={(e) => setschema(e.target.value)}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <label
                          htmlFor="input-treasury"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Source Code URL
                        </label>
                        <input
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          type="text"
                          id="input-treasury"
                          value={sourcecodeUrl}
                          onChange={(e) => setsourcecodeUrl(e.target.value)}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <label
                          htmlFor="input-desc"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          className="focus:outline-none focus:ring-2 focus:ring-gray-200 block w-full p-2 sm:text-sm border-solid border-2 border-gray-200 rounded-xl"
                          type="text"
                          id="input-desc"
                          onChange={(e) => setosdesc(e.target.value)}
                          value={osdesc}
                        />
                      </div>
                    </div>
                    <div className="form-buttons">
                      <button
                        onClick={nextStep}
                        disabled={isFormFilled()}
                        className="button block ml-auto text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none disabled:opacity-50 "
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : step === 2 ? (
                  <div className="form-container mb-5 step step-2">
                    <div className="form-wrapper mb-6">
                      <h3 className="mb-4">
                        <strong>Step 2:</strong> Choose how to add the oracle script code
                      </h3>

                      <div className="flex gap-6 radio-group choice-code">
                        <div className="flex-grow flex-shrink w-1/2 input-group mb-3">
                          <input
                            type="radio"
                            name="codeType"
                            id="input-codeType-upload"
                            value="upload"
                            checked={codeType === "upload"}
                            onChange={(e) => setCodeType(e.target.value)}
                          />
                          <label
                            htmlFor="input-codeType-upload"
                            className="hover:bg-indigo-50 w-full label-btn button p-4 border-2 border-gray-300 block rounded-xl text-center cursor-pointer"
                          >
                            <img
                              src="/images/uploading.png"
                              alt=""
                              className="w-full mx-auto block mb-2"
                              style={{
                                maxWidth: "103px",
                              }}
                            />
                            Upload from my computer (.rust)
                          </label>
                        </div>
                        <div className="flex-grow flex-shrink w-1/2 input-group mb-3">
                          <input
                            type="radio"
                            name="codeType"
                            id="input-codeType-editor"
                            value="editor"
                            checked={codeType === "editor"}
                            onChange={(e) => setCodeType(e.target.value)}
                          />
                          <label
                            htmlFor="input-codeType-editor"
                            className="hover:bg-indigo-50  w-full label-btn button p-4 border-2 border-gray-300 block rounded-xl text-center cursor-pointer"
                          >
                            <img
                              src="/images/code.png"
                              alt=""
                              className="w-full mx-auto block mb-2"
                              style={{
                                maxWidth: "103px",
                              }}
                            />
                            Using Code Editor
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-buttons flex justify-between">
                      <button
                        onClick={prevStep}
                        className="button block  text-md text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextStep}
                        className="button block text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : step === 3 ? (
                  <div className="form-container mb-5 step step-2">
                    <div className="form-wrapper mb-6">
                      <h3 className="mb-4">
                        <strong>Step 2.1:</strong> Add the oracle script code (.rust)
                      </h3>
                      {renderSwitchCode()}
                    </div>
                    <div className="form-buttons flex justify-between">
                      <button
                        onClick={prevStep}
                        className="button block  text-md text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Previous
                      </button>
                      <button
                        disabled={code.byteLength > 0 ? false : codeEditor === ""}
                        onClick={(e) => compileCode()}
                        className="disabled:opacity-50 button block text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : step === 4 ? (
                  <div className="form-container mb-5 step step-2">
                    <div className="form-wrapper mb-6">
                      <h3 className="mb-4">
                        <strong>Step 3:</strong> Review
                      </h3>
                      <Editor
                        value={previewJson}
                        onValueChange={(rawcode) => setPreviewJson(rawcode)}
                        highlight={(rawcode) => highlight(rawcode, languages.json)}
                        padding={15}
                        style={{
                          fontFamily: '"Fira code", "Fira Mono", monospace',
                          fontSize: 12,
                          background: "#282A2B",
                          color: "white",
                          borderRadius: "10px",
                          minHeight: "300px",
                        }}
                      />
                    </div>
                    <div className="form-buttons flex justify-between">
                      <button
                        onClick={prevStep}
                        className="button block  text-md text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Previous
                      </button>
                      <button
                        onClick={(e) => submitCode()}
                        className="button block text-md text-white bg-black hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                      >
                        Confirm and Deploy
                      </button>
                    </div>
                  </div>
                ) : step === 5 ? (
                  isbroadcasting ? (
                    <div className="p-6 form-wrapper flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : (
                    <div className="p-6 form-wrapper flex items-center justify-center">
                      <div className="form-container">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-20 w-20 text-green-400 mx-auto mb-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h4 className="text-md text-center">
                          <strong>Transaction Hash</strong>
                        </h4>
                        <a
                          className="overflow-ellipsis overflow-hidden text-black mb-3 block hover:text-blue text-center"
                          href={`https://laozi-testnet4.cosmoscan.io/tx/${txhash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {txhash}
                        </a>
                        <button
                          onClick={(e) => setStep(1)}
                          className="button block mx-auto text-sm text-black hover:text-white bg-white hover:bg-black border-2 border-black focus:outline-none focus:ring-black focus:ring-opacity-50  py-2 px-10 rounded-xl focus:outline-none"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
