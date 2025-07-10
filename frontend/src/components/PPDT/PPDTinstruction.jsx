import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function PPDTinstruction() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4">
        <div className="bg-blue-100 border border-gray-300 p-6 md:p-8 rounded-md w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">
            Instructions [PPDT]
          </h1>

          <div className="bg-white border border-gray-300 rounded-md p-4 md:p-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg font-poppins">
              <li>
                This test is designed to assess your{" "}
                <b>perception, imagination, and decision-making ability</b>.
              </li>
              <li>
                You will be shown a total of <b>1 picture</b> for a duration of{" "}
                <b>30 seconds</b>.
              </li>
              <li>
                Observe the picture carefully and note down{" "}
                <b>
                  the number of characters, their mood, age, gender, and what is
                  happening
                </b>
                .
              </li>
              <li>
                After the picture disappears, you will have <b>4 minutes</b> to
                write a complete story around it.
              </li>
              <li>
                The story should include{" "}
                <b>
                  what led to the scene, what is happening now, and what will
                  happen next
                </b>
                .
              </li>
              <li>
                Keep your story <b>positive, realistic, and action-oriented</b>,
                reflecting Officer-Like Qualities (OLQs).
              </li>
              <li>
                Do not refresh or close the browser during the test, as it may
                result in loss of progress.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-300 ease-in-out"
              onClick={() => navigate("/alltest/ppdt/displayppdtquestion")}
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

export default PPDTinstruction;
