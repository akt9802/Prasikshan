import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function SRTinstruction() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4">
        <div className="bg-blue-100 border border-gray-300 p-6 md:p-8 rounded-md  max-w-1xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">
            Instructions [SRT]
          </h1>

          <div className="bg-white border border-gray-300 rounded-md p-4 md:p-6 font-poppins">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg">
              <li>
                This test is designed to assess your{" "}
                <b>
                  decision-making, presence of mind, and Officer-Like Qualities
                  (OLQs)
                </b>
                .
              </li>
              <li>
                You will be presented with a total of <b>60 situations</b> one
                after another.
              </li>
              <li>
                Each situation describes a real-life scenario. You are required
                to write your <b>immediate and appropriate reaction</b> to each
                within the given time.
              </li>
              <li>
                You will have <b>30 seconds per situation</b> to write your
                response.
              </li>
              <li>
                Keep your responses <b>short, practical, and positive</b>,
                demonstrating qualities like leadership, courage, and social
                adaptability.
              </li>
              <li>
                Avoid negative responses or leaving any situation unanswered.
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
              onClick={() => navigate("/alltest/srt/displaysrtquestions")}
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

export default SRTinstruction;
