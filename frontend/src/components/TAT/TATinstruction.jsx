import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function TATinstruction() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4">
        <div className="bg-blue-100 border border-gray-300 p-6 md:p-8 rounded-md w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">
            Instructions [TAT]
          </h1>

          <div className="bg-white border border-gray-300 rounded-md p-4 md:p-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg font-poppins">
              <li>
                This test is designed to assess your{" "}
                <b>
                  imagination, perception, and ability to analyze situations
                </b>
                .
              </li>
              <li>
                You will be shown a total of <b>12 pictures</b> one after
                another.
              </li>
              <li>
                Each picture will be displayed for <b>30 seconds</b>. Observe
                carefully and think about the possible situation.
              </li>
              <li>
                After each picture disappears, you will have <b>4 minutes</b> to
                write a story based on it.
              </li>
              <li>
                Your story should include{" "}
                <b>
                  what led to the situation, what is happening now, and what
                  will happen next
                </b>
                .
              </li>
              <li>
                Ensure your story is{" "}
                <b>
                  positive, logical, and reflects Officer-Like Qualities (OLQs)
                </b>
                .
              </li>
              <li>
                Do not refresh or close the browser during the test to avoid
                losing progress.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-300 ease-in-out"
              onClick={() => navigate("/alltest/tat/displaytatquestions")}
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

export default TATinstruction;
