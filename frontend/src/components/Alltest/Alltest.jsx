import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function Alltest() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          padding: "50px 5vw",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          background: "linear-gradient(to bottom, #D7F1FF 0%, #62B5E2 100%)",
        }}
      >
        {["oir", "ppdt", "tat", "wat", "sat", "lecturette", "pi"].map(
          (id, idx) => {
            const titles = [
              "Officer Intelligence Rating Test",
              "Picture Perception and Discussion Test",
              "Thematic Apperception Test",
              "Word Association Test",
              "Situation Reaction Test",
              "Lecturette",
              "Personal Interview",
            ];

            const descriptions = [
              "The Officer Intelligence Rating (OIR) Test is conducted on Day 1 and assesses a candidate’s logical and analytical abilities. It includes both verbal (like analogies and coding-decoding) and non-verbal (like pattern recognition) reasoning questions. The score helps determine whether the candidate proceeds to further SSB rounds.",
              "The Picture Perception and Discussion Test (PPDT) involves viewing a blurred image for 30 seconds and writing a story based on it within 4 minutes. Candidates then participate in a group discussion to create a common story. It assesses observation, imagination, communication skills, and group dynamics.",
              "The Thematic Apperception Test (TAT) presents 12 images (including one blank) to candidates, each shown for 30 seconds. Candidates must write a story for each image within 4 minutes. It evaluates mindset, emotions, and problem-solving ability through the themes reflected in the stories.",
              "The Word Association Test (WAT) shows 60 words, each for 15 seconds, and candidates must write the first thought that comes to mind. It reveals their spontaneous thinking and subconscious mindset. The test evaluates attitude, emotional maturity, and clarity of thought.",
              "The Situation Reaction Test (SRT) presents 60 real-life scenarios to which candidates must write quick responses. It assesses decision-making, presence of mind, and how one reacts under pressure. Responses reflect the candidate’s practical thinking and sense of responsibility.",
              "The Lecturette is an individual speaking task where candidates choose a topic, prepare for 3 minutes, and speak for 3 minutes before the group. It assesses clarity of thought, confidence, and communication skills. The test evaluates how well a candidate presents ideas and handles pressure.",
              "The Personal Interview is an interactive session between the candidate and the Interviewing Officer. It assesses the candidate’s personality, social adaptability, confidence, and Officer-Like Qualities (OLQs) through questions about their background, academics, hobbies, and current affairs. The interview evaluates the candidate’s honesty, presence of mind, and ability to communicate effectively under pressure.",
            ];

            const routes = [
              "/alltest/oir",
              "/alltest/ppdt",
              "/alltest/tat",
              "/alltest/wat",
              "/alltest/sat",
              "/alltest/lecturette",
              "/alltest/pi",
            ];

            const labels = [
              "OIR",
              "PPDT",
              "TAT",
              "WAT",
              "SRT",
              "LECTURETTE",
              "PI",
            ];

            return (
              <div
                key={id}
                id={id}
                style={{
                  backgroundColor: "#EDF9FF",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  border: "2px solid black",
                  borderRadius: "8px",
                  gap: "20px",
                  minHeight: "200px",
                }}
              >
                <div
                  style={{
                    width: "250px",
                    height: "150px",
                    border: "3px solid #888",
                    fontSize: "35px",
                    fontWeight: 800,
                    fontFamily: "Montserrat, sans-serif",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {labels[idx]}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 300,
                        fontSize: "24px",
                      }}
                    >
                      {titles[idx]}
                    </h2>
                    <button
                      style={{
                        padding: "6px 12px",
                        fontWeight: "bold",
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(routes[idx])}
                    >
                      Practice Now
                    </button>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      lineHeight: "1.4",
                      color: "#333",
                      fontFamily: "Montserrat, sans-serif",
                      marginTop: "10px",
                    }}
                  >
                    {descriptions[idx]}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
      <Footer />
    </>
  );
}

export default Alltest;
