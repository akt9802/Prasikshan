import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer.jsx";
import { useNavigate } from "react-router-dom";

function DisplaySrtQuestion() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes = 1800 sec
  const [stage, setStage] = useState("loading"); // loading, showSituations, showReactions
  const [srtData, setSrtData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSRTQuestions = async () => {
      try {
        const response = await fetch("https://prasikshan-79z7.onrender.com/alltest/srt/displaysrtquestions");
        if (!response.ok) {
          throw new Error("Failed to fetch SRT questions");
        }
        const data = await response.json();
        console.log("Fetched SRT Questions:", data);
        setSrtData(data);
        setStage("showSituations");
      } catch (err) {
        console.error("Error fetching SRT questions:", err);
      }
    };

    fetchSRTQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === "showSituations" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "showSituations" && timeLeft === 0) {
      setStage("showReactions");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage]);

  const stopHandler = () => {
    setStage("showReactions");
  };

  const goToAllTest = () => {
    navigate("/alltest");
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (stage === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading SRT Questions...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Floating Timer on Left */}
      <div className="fixed top-20 left-5 bg-white border border-gray-300 shadow-xl rounded-full px-6 py-3 flex items-center space-x-2 z-50">
        <span className="text-lg font-semibold text-gray-700">⏳</span>
        <span className="text-xl font-bold text-blue-600">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Main Content */}
      <main
        className="flex-grow py-10 px-4 bg-gradient-to-b from-blue-100 to-blue-300"
        style={{ paddingTop: "60px", paddingBottom: "60px" }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Show Situations */}
          {stage === "showSituations" && srtData.length > 0 && (
            <>
              {srtData.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm text-left"
                >
                  <h2 className="font-bold text-lg mb-2">
                    {index + 1}. Situation :
                  </h2>
                  <p className="text-gray-800">{item.situation}</p>
                </div>
              ))}

              {/* Stop Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={stopHandler}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-md shadow"
                >
                  Stop
                </button>
              </div>
            </>
          )}

          {/* Show Reactions */}
          {stage === "showReactions" && srtData.length > 0 && (
            <>
              {srtData.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm text-left"
                >
                  <h2 className="font-bold text-lg mb-2">
                    {index + 1}. Situation :
                  </h2>
                  <p className="text-gray-800 mb-2">{item.situation}</p>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Reaction :
                  </h3>
                  <p className="text-gray-800">{item.sample_reaction}</p>
                </div>
              ))}

              {/* Go To All Test Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={goToAllTest}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-md shadow"
                >
                  Go To All Test
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DisplaySrtQuestion;
