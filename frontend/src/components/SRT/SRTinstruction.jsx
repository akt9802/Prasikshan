import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";
function SATinstruction() {
    const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            Instructions [SRT]
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
                  decision-making, presence of mind, and Officer-Like Qualities
                  (OLQs)
                </b>
                .
              </li>
              <li style={{ fontSize: "20px" }}>
                You will be presented with a total of <b>60 situations</b> one
                after another.
              </li>
              <li style={{ fontSize: "20px" }}>
                Each situation describes a real-life scenario. You are required
                to write your <b>immediate and appropriate reaction</b> to each
                within the given time.
              </li>
              <li style={{ fontSize: "20px" }}>
                You will have <b>30 seconds per situation</b> to write your
                response.
              </li>
              <li style={{ fontSize: "20px" }}>
                Keep your responses <b>short, practical, and positive</b>,
                demonstrating qualities like leadership, courage, and social
                adaptability.
              </li>
              <li style={{ fontSize: "20px" }}>
                Avoid negative responses or leaving any situation unanswered.
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
                onClick={() => navigate("/alltest/srt/displaysrtquestions")}
              style={{
                cursor: "pointer",
              }}
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

export default SATinstruction;
