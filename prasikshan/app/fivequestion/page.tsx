"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";

export default function FiveQuestion() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push("/fivequestion/displayfivequestion");
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4">
        <div className="bg-blue-100 border border-gray-300 p-6 md:p-8 rounded-md w-full max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">
            Instructions [Five Question Quiz]
          </h1>

          <div className="bg-white border border-gray-300 rounded-md p-4 md:p-6" style={{ fontFamily: "Poppins" }}>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-base md:text-lg">
              <li>
                There will be a total of <b>five questions</b> in this quiz to assess your quick thinking and knowledge.
              </li>
              <li>
                You will have a <b>limited time</b> to answer each question. Manage your time wisely.
              </li>
              <li>
                Answer each question properly to the best of your ability without overthinking.
              </li>
              <li>
                <b>No negative marking</b> - attempt all questions to maximize your score.
              </li>
              <li>
                Do not refresh or close the browser window during the quiz, as it may disrupt the test.
              </li>
              <li>
                Maintain focus and avoid distractions while attempting the questions.
              </li>
              <li>
                Your performance will be evaluated and added to your overall progress record.
              </li>
            </ol>
          </div>

          {/* Start Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleStartQuiz}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-md shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              style={{ cursor: "pointer" }}
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
