import Footer from "../Footer/Footer.jsx";
import React from "react";
// import { useNavigate } from "react-router-dom";
function LECTURETTEinstruction() {
  //   const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-180px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            Instructions [LECTURETTE]
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
                  communication skills, confidence, clarity of thought, and
                  Officer-Like Qualities (OLQs)
                </b>
                .
              </li>
              <li style={{ fontSize: "20px" }}>
                You will be given a <b>card with four topics</b>. You must
                choose <b>one topic</b> to speak on.
              </li>
              <li style={{ fontSize: "20px" }}>
                You will get <b>3 minutes of preparation time</b> to organize
                your thoughts.
              </li>
              <li style={{ fontSize: "20px" }}>
                After preparation, you will speak on the selected topic for{" "}
                <b>3 minutes</b>.
              </li>
              <li style={{ fontSize: "20px" }}>
                Your talk should be <b>structured, logical, and to the point</b>
                , covering key facts and your views.
              </li>
              <li style={{ fontSize: "20px" }}>
                Speak clearly and confidently. Avoid unnecessary pauses or
                repetition.
              </li>
              <li style={{ fontSize: "20px" }}>
                Maintain good posture, eye contact, and a calm tone throughout
                the talk.
              </li>
              <li style={{ fontSize: "20px" }}>
                Do not refresh or close the browser during the test, as it may
                disrupt the process.
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

export default LECTURETTEinstruction;
