import React from "react";

function MCQquestion({
  question = "No Question",
  options = ["a", "b", "c", "d"],
  name,
  onChange,
  selectedAnswer,
  correctAnswer,
}) {
  return (
    <div className="bg-white border border-gray-400 rounded-md p-4 w-full max-w-3xl mx-auto">
      <p className="font-semibold mb-4">
        <span className="font-bold">Ques:</span> {question}
      </p>
      <div className="grid grid-cols-2 gap-y-2 gap-x-8">
        {options.map((option, index) => {
          const normalizedOption = option.trim().toLowerCase();
          const normalizedCorrect = correctAnswer?.trim().toLowerCase();
          const normalizedSelected = selectedAnswer?.trim().toLowerCase();

          const isCorrect =
            correctAnswer && normalizedOption === normalizedCorrect;

          const isWrongSelected =
            correctAnswer &&
            normalizedOption === normalizedSelected &&
            normalizedSelected !== normalizedCorrect;

          const highlightClass = isCorrect
            ? "bg-green-200 border-green-500"
            : isWrongSelected
            ? "bg-red-200 border-red-500"
            : "border-gray-300";

          return (
            <label
              key={index}
              className={`flex items-center space-x-2 text-gray-800 p-2 rounded-md border ${highlightClass}`}
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={selectedAnswer === option}
                onChange={!correctAnswer ? onChange : undefined}
                disabled={!!correctAnswer} 
                className="accent-blue-500"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default MCQquestion;
