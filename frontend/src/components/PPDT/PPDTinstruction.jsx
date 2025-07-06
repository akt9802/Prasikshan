import Footer from "../Footer/Footer.jsx";
import React from "react";
// import { useNavigate } from "react-router-dom";
function PPDTinstruction() {
//   const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-180px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-center mb-4">Instructions [PPDT]</h1>
          <div
            className="bg-white border border-gray-300 rounded-md p-4"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <ol className="list-decimal list-inside text-base space-y-2 text-gray-700">
              <li style={{ fontSize: "20px" }}>
                This test is designed to assess your{" "}
                <b>perception, imagination, and decision-making ability</b>.
              </li>
              <li style={{ fontSize: "20px" }}>
                You will be shown a total of <b>1 picture</b> for a duration of{" "}
                <b>30 seconds</b>.
              </li>
              <li style={{ fontSize: "20px" }}>
                Observe the picture carefully and note down{" "}
                <b>
                  the number of characters, their mood, age, gender, and what is
                  happening
                </b>
                .
              </li>
              <li style={{ fontSize: "20px" }}>
                After the picture disappears, you will have <b>4 minutes</b> to
                write a complete story around it.
              </li>
              <li style={{ fontSize: "20px" }}>
                The story should include{" "}
                <b>
                  what led to the scene, what is happening now, and what will
                  happen next
                </b>
                .
              </li>
              <li style={{ fontSize: "20px" }}>
                Keep your story <b>positive, realistic, and action-oriented</b>,
                reflecting Officer-Like Qualities (OLQs).
              </li>
              <li style={{ fontSize: "20px" }}>
                Do not refresh or close the browser during the test, as it may
                result in loss of progress.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
            //   onClick={() => navigate("/alltest/oir/displayoirquestions")}
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

export default PPDTinstruction;
