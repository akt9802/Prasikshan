import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";
function PIinstuction() {
    const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-180px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            Instructions [PI]
          </h1>
          <div
            className="bg-white border border-gray-300 rounded-md p-4"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <ol className="list-decimal list-inside text-base space-y-2 text-gray-700">
              <li style={{ fontSize: "20px" }}>
                This session is designed to assess your{" "}
                <b>
                  personality, confidence, communication skills, and
                  Officer-Like Qualities (OLQs)
                </b>
                through an interactive interview.
              </li>
              <li style={{ fontSize: "20px" }}>
                You will have a one-on-one interview with the assessor where you
                will be asked questions about your{" "}
                <b>
                  personal life, academics, hobbies, achievements, and current
                  affairs
                </b>
                .
              </li>
              <li style={{ fontSize: "20px" }}>
                The duration of the interview is approximately{" "}
                <b>30 to 60 minutes</b>.
              </li>
              <li style={{ fontSize: "20px" }}>
                Answer all questions honestly, confidently, and with clarity.
                Avoid giving memorized or exaggerated responses.
              </li>
              <li style={{ fontSize: "20px" }}>
                Maintain a{" "}
                <b>
                  positive attitude, proper posture, and natural eye contact
                </b>{" "}
                throughout the interview.
              </li>
              <li style={{ fontSize: "20px" }}>
                Listen carefully to the questions and respond in a calm and
                composed manner.
              </li>
              <li style={{ fontSize: "20px" }}>
                Do not refresh or close the browser during the session, as it
                may disrupt the interview process.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
                onClick={() => navigate("/alltest/pi/displaypiquestions")}
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

export default PIinstuction;
