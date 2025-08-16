import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";
const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;

function DisplayLecturetteQuestion() {
  const [stage, setStage] = useState("loading"); // loading, showTopic, showSpeech
  const [lecturette, setLecturette] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 sec
  const navigate = useNavigate();
  // Submit Lecturette test result to backend
  const submitLecturetteTestResult = async () => {
    const testResult = {
      testName: "Lecturette Test",
      score: 1, // or your scoring logic
      timeTaken: 180 - timeLeft, // seconds taken
      dateTaken: new Date().toISOString(),
    };

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${apiURL}/v1/addLecturetteTestResult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testResult),
      });
    } catch (err) {
      console.error("Failed to save Lecturette test result", err);
    }
  };

  useEffect(() => {
    const fetchLecturette = async () => {
      try {
        const response = await fetch(
          `${apiURL}/alltest/lecturette/DisplayLecturetteQuestion`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lecturette topic");
        }
        const data = await response.json();
        setLecturette(data);
        setStage("showTopic");
      } catch (error) {
        console.error("Error fetching lecturette:", error);
      }
    };

    fetchLecturette();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === "showTopic" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "showTopic" && timeLeft === 0) {
      setStage("showSpeech");
      submitLecturetteTestResult();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage]);

  const stopHandler = () => {
    setStage("showSpeech");
    submitLecturetteTestResult();
  };

  const goToAllTest = () => {
    navigate("/alltest");
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(1, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec} MIN`;
  };

  if (stage === "loading" || !lecturette) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading Lecturette Topic...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300"
        style={{
          minHeight: "100vh",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-10 w-[90%] max-w-3xl text-center shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold mb-6">
            {lecturette.topic}
          </h1>

          {stage === "showTopic" && (
            <>
              <div className="mb-6">
                <span className="inline-block bg-gray-200 text-black font-semibold py-2 px-5 rounded-full text-xl">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={stopHandler}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md shadow"
              >
                Stop
              </button>
            </>
          )}

          {stage === "showSpeech" && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm text-left mb-6">
                <p className="text-gray-800">{lecturette.speech}</p>
              </div>
              <button
                onClick={goToAllTest}
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow"
              >
                Go to All Test
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayLecturetteQuestion;
