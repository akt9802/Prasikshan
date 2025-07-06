import Footer from "../Footer/Footer.jsx";
import React from "react";
// import { useNavigate } from "react-router-dom";
function WATinstruction() {
  //   const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-180px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            Instructions [WAT]
          </h1>
          <div
            className="bg-white border border-gray-300 rounded-md p-4"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <ol className="list-decimal list-inside text-base space-y-2 text-gray-700">
              <li style={{ fontSize: "20px" }}>
                This test is designed to assess your{" "}
                <b>
                  thought process, attitude, and Officer-Like Qualities (OLQs)
                </b>
                .
              </li>
              <li style={{ fontSize: "20px" }}>
                You will be shown a total of <b>60 words</b>, one after another.
              </li>
              <li style={{ fontSize: "20px" }}>
                Each word will be displayed for <b>15 seconds</b>. You must form
                and write a meaningful sentence using that word within the time.
              </li>
              <li style={{ fontSize: "20px" }}>
                Your sentences should be{" "}
                <b>positive, practical, and action-oriented</b>, reflecting your
                personality and decision-making skills.
              </li>
              <li style={{ fontSize: "20px" }}>
                Avoid negative thoughts or vague sentences. Focus on showing
                clarity and confidence.
              </li>
              <li style={{ fontSize: "20px" }}>
                Do not refresh or close the browser during the test, as it may
                lead to loss of progress.
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

export default WATinstruction;
