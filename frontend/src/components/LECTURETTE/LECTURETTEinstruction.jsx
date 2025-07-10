import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function LECTURETTEinstruction() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4">
        <div className="bg-blue-100 border border-gray-300 p-6 md:p-8 rounded-md w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">
            Instructions [LECTURETTE]
          </h1>

          <div className="bg-white border border-gray-300 rounded-md p-4 md:p-6 font-poppins">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg">
              <li>
                This test is designed to assess your{" "}
                <b>
                  communication skills, confidence, clarity of thought, and
                  Officer-Like Qualities (OLQs)
                </b>
                .
              </li>
              <li>
                You will be given a <b>card with four topics</b>. You must
                choose <b>one topic</b> to speak on.
              </li>
              <li>
                You will get <b>3 minutes of preparation time</b> to organize
                your thoughts.
              </li>
              <li>
                After preparation, you will speak on the selected topic for{" "}
                <b>3 minutes</b>.
              </li>
              <li>
                Your talk should be <b>structured, logical, and to the point</b>
                , covering key facts and your views.
              </li>
              <li>
                Speak clearly and confidently. Avoid unnecessary pauses or
                repetition.
              </li>
              <li>
                Maintain good posture, eye contact, and a calm tone throughout
                the talk.
              </li>
              <li>
                Do not refresh or close the browser during the test, as it may
                disrupt the process.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-300 ease-in-out"
              onClick={() =>
                navigate("/alltest/lecturette/DisplayLecturetteQuestion")
              }
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

export default LECTURETTEinstruction;
