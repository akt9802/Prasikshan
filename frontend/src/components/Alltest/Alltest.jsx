import Footer from "../Footer/Footer.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

function Alltest() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          paddingLeft: "100px",
          paddingRight: "100px",
          paddingTop: "50px",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          background: "linear-gradient(to bottom, #D7F1FF 0%, #62B5E2 100%)",
        }}
      >
        {/* OIR DIV */}
        <div
          id="oir"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "50px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            OIR
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Officer Intelligence Rating Test
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
                onClick={() => navigate("/alltest/oir")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Officer Intelligence Rating (OIR) Test is conducted on Day 1
              and assesses a candidate’s logical and analytical abilities. It
              includes both verbal (like analogies and coding-decoding) and
              non-verbal (like pattern recognition) reasoning questions. The
              score helps determine whether the candidate proceeds to further
              SSB rounds.
            </p>
          </div>
        </div>

        {/* PPDT DIV */}
        <div
          id="ppdt"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "50px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            PPDT
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Picture Perception and Discussion Test
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
                onClick={() => navigate("/alltest/ppdt")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Picture Perception and Discussion Test (PPDT) involves viewing
              a blurred image for 30 seconds and writing a story based on it
              within 4 minutes. Candidates then participate in a group
              discussion to create a common story. It assesses observation,
              imagination, communication skills, and group dynamics.
            </p>
          </div>
        </div>

        {/* TAT DIV */}
        <div
          id="tat"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "50px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            TAT
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Thematic Apperception Test
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
                onClick={() => navigate("/alltest/tat")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Thematic Apperception Test (TAT) presents 12 images (including
              one blank) to candidates, each shown for 30 seconds. Candidates
              must write a story for each image within 4 minutes. It evaluates
              mindset, emotions, and problem-solving ability through the themes
              reflected in the stories.
            </p>
          </div>
        </div>

        {/* WAT DIV */}
        <div
          id="wat"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "50px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            WAT
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Word Association Test
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
                onClick={() => navigate("/alltest/wat")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Word Association Test (WAT) shows 60 words, each for 15
              seconds, and candidates must write the first thought that comes to
              mind. It reveals their spontaneous thinking and subconscious
              mindset. The test evaluates attitude, emotional maturity, and
              clarity of thought.
            </p>
          </div>
        </div>

        {/* SRT DIV */}
        <div
          id="sat"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "50px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            SRT
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Situation Reaction Test
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
                onClick={() => navigate("/alltest/sat")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Situation Reaction Test (SRT) presents 60 real-life scenarios
              to which candidates must write quick responses. It assesses
              decision-making, presence of mind, and how one reacts under
              pressure. Responses reflect the candidate’s practical thinking and
              sense of responsibility.
            </p>
          </div>
        </div>

        {/* LECTURETTE DIV */}
        <div
          id="lecturette"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "35px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            LECTURETTE
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Lecturette
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
                onClick={() => navigate("/alltest/lecturette")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Lecturette is an individual speaking task where candidates
              choose a topic, prepare for 3 minutes, and speak for 3 minutes
              before the group. It assesses clarity of thought, confidence, and
              communication skills. The test evaluates how well a candidate
              presents ideas and handles pressure.
            </p>
          </div>
        </div>

        {/* PI DIV */}
        <div
          id="pi"
          style={{
            backgroundColor: "#EDF9FF",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            border: "2px solid black",
            borderRadius: "8px",
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "150px",
              border: "3px solid #888",
              padding: "40px 40px",
              fontSize: "50px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              marginRight: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // color: "transparent",
            }}
          >
            PI
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: "30px",
                }}
              >
                Personal Interview
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
                onClick={() => navigate("/alltest/pi")}
              >
                Practice Now
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "20px",
                lineHeight: "1.3",
                color: "#333",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              The Personal Interview is an interactive session between the
              candidate and the Interviewing Officer. It assesses the
              candidate’s personality, social adaptability, confidence, and
              Officer-Like Qualities (OLQs) through questions about their
              background, academics, hobbies, and current affairs. The interview
              evaluates the candidate’s honesty, presence of mind, and ability
              to communicate effectively under pressure.
            </p>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default Alltest;
