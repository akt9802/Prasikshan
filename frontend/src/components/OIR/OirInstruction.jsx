import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";
function OirInstruction() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-180px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-center mb-4">Instructions [OIR]</h1>
          <div
            className="bg-white border border-gray-300 rounded-md p-4"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <ol className="list-decimal list-inside text-base space-y-2 text-gray-700">
              <li style={{ fontSize: "20px" }}>
                This test consists of{" "}
                <b>questions</b> designed to
                assess your intelligence rating.
              </li>
              <li style={{ fontSize: "20px" }}>
                You will have a total of <b>40 questions</b> to solve within the
                allotted time.
              </li>
              <li style={{ fontSize: "20px" }}>
                There is <b>no negative marking</b>, so attempt as many
                questions as possible.
              </li>
              <li style={{ fontSize: "20px" }}>
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
              style={{
                cursor: "pointer",
              }}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OirInstruction;
