import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function OirInstruction() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">
            Instructions [OIR]
          </h1>

          <div className="bg-white border border-gray-300 rounded-md p-4 md:p-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg font-poppins">
              <li>
                This test consists of <b>questions</b> designed to assess your
                intelligence rating.
              </li>
              <li>
                You will have a total of <b>40 questions</b> to solve within the
                allotted time.
              </li>
              <li>
                There is <b>no negative marking</b>, so attempt as many
                questions as possible.
              </li>
              <li>
                Maintain focus and complete the test without refreshing or
                closing the browser window.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
              onClick={() => navigate("/alltest/oir/displayoirquestions")}
            >
              Try Now
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OirInstruction;
