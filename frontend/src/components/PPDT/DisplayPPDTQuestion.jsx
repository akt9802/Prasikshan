import React, { useState, useEffect } from "react";

function DisplayPPDTQuestion() {
  const [stage, setStage] = useState("loading"); // loading, viewImage, waitStory, showStories
  const [timeLeft, setTimeLeft] = useState(30); // 30 sec for image
  const [question, setQuestion] = useState(null); // Holds fetched data

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch("/alltest/ppdt/displayppdtquestions"); // using proxy
        if (!response.ok) {
          throw new Error("Failed to fetch PPDT question");
        }
        const data = await response.json();
        console.log("Fetched Question:", data); // Debug fetched data
        setQuestion(data);
        setStage("viewImage");
      } catch (err) {
        console.error("Error fetching PPDT question:", err);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === "viewImage" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "viewImage" && timeLeft === 0) {
      setStage("waitStory");
      setTimeLeft(240); // 4 minutes
    } else if (stage === "waitStory" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "waitStory" && timeLeft === 0) {
      setStage("showStories");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage]);

  const stopTimer = () => {
    if (stage === "waitStory") {
      setStage("showStories");
    }
  };

  if (stage === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading PPDT Question...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-8 w-[90%] max-w-3xl text-center shadow-lg">
        <div className="mb-4">
          <span className="inline-block bg-gray-200 text-black font-semibold py-1 px-3 rounded-full text-lg">
            {timeLeft} SEC
          </span>
        </div>

        {/* Display Image */}
        {(stage === "viewImage" || stage === "showStories") && question && (
          <div className="flex justify-center mb-6">
            <img
              src={question.image}
              alt="PPDT Scene"
              className="rounded-md border border-gray-400 max-w-full"
              onError={(e) => {
                console.error("Image failed to load:", question.image);
                e.target.src =
                  "https://via.placeholder.com/600x400?text=Image+Not+Available";
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
          </div>
        )}

        {/* Stop Button */}
        {stage === "waitStory" && (
          <button
            onClick={stopTimer}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow"
          >
            Stop
          </button>
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
  );
}

export default DisplayPPDTQuestion;
