import Footer from "../Footer/Footer.jsx";
import React, { useState, useEffect } from "react";

function DisplayPPDTQuestion() {
  const [stage, setStage] = useState("loading"); // loading, viewImage, waitStory, showStories
  const [timeLeft, setTimeLeft] = useState(30); // 30 sec for image
  const [question, setQuestion] = useState(null); // Holds fetched data
  const [imageLoaded, setImageLoaded] = useState(false); // Track image loading

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch("https://prasikshan-79z7.onrender.com/alltest/ppdt/displayppdtquestions"); // using proxy
        if (!response.ok) {
          throw new Error("Failed to fetch PPDT question");
        }
        const data = await response.json();
        console.log("Fetched Question:", data); // Debug fetched data
        setQuestion(data);
        // We wait for image to load before starting timer
      } catch (err) {
        console.error("Error fetching PPDT question:", err);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === "viewImage" && timeLeft > 0 && imageLoaded) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "viewImage" && timeLeft === 0) {
      setStage("waitStory");
      setTimeLeft(240); // 4 minutes for story
    } else if (stage === "waitStory" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "waitStory" && timeLeft === 0) {
      setStage("showStories");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage, imageLoaded]);

  const stopTimer = () => {
    if (stage === "waitStory") {
      setStage("showStories");
    }
  };

  if (!question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading PPDT Question...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 pt-10 pb-10">
        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-8 w-[90%] max-w-3xl text-center shadow-lg">
          {/* Timer Display */}
          {(stage === "viewImage" || stage === "waitStory") && imageLoaded && (
            <div className="mb-4">
              <span className="inline-block bg-gray-200 text-black font-semibold py-1 px-3 rounded-full text-lg">
                {timeLeft} SEC
              </span>
            </div>
          )}

          {/* Display Image */}
          {(stage === "loading" ||
            stage === "viewImage" ||
            stage === "showStories") && (
            <div className="flex justify-center mb-6 relative">
              {!imageLoaded && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Loading image...</p>
                </div>
              )}
              <img
                src={question.image}
                alt="PPDT Scene"
                className={`rounded-md border border-gray-400 max-w-full ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => {
                  setImageLoaded(true);
                  if (stage === "loading") {
                    setStage("viewImage");
                  }
                }}
                onError={(e) => {
                  console.error("Image failed to load:", question.image);
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=Image+Not+Available";
                  setImageLoaded(true);
                  if (stage === "loading") {
                    setStage("viewImage");
                  }
                }}
              />
            </div>
          )}

          {/* Wait Story Timer */}
          {stage === "waitStory" && (
            <div className="mb-6">
              <p className="text-lg text-gray-700">
                Think and prepare your story…
              </p>
              <button
                onClick={stopTimer}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Stop
              </button>
            </div>
          )}

          {/* Show Stories */}
          {stage === "showStories" && question && (
            <div className="space-y-4">
              {question.stories.map((story, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
                >
                  <h2 className="font-bold text-lg mb-2">
                    {story.title.toUpperCase()}
                  </h2>
                  <p className="text-gray-800">{story.narration}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayPPDTQuestion;
