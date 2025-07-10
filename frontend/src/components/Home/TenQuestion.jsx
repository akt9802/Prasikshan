import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";
function TenQuestion() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-blue-100 border border-gray-300 p-6 rounded-md w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-4">Instructions</h1>
          <div
            className="bg-white border border-gray-300 rounded-md p-4"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <ol className="list-decimal list-inside text-base space-y-2 text-gray-700">
              <li style={{ fontSize: "20px" }}>
                There will be a total of <b>ten questions</b> in this quiz.
              </li>
              <li style={{ fontSize: "20px" }}>
                Do not refresh or close the browser window during the quiz.
              </li>
              <li style={{ fontSize: "20px" }}>
                Answer each question properly to the best of your ability.
              </li>
              <li style={{ fontSize: "20px" }}>
                Do not attempt to cheat; any suspicious activity will end the
                quiz.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
              onClick={() => navigate("/tenquestion/displaytenquestion")}
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

export default TenQuestion;
