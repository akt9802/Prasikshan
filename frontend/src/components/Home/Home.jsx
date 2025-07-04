import React, { useState } from "react";
import homeimage from "../../assets/home-image-logo.jpg";
import { Typewriter } from "react-simple-typewriter";
import SmallCardHome from "./small-card-home";
import Footer from "../Footer/Footer.jsx";

import { useNavigate } from "react-router-dom";

function Home() {
  const [userCount, setuserCount] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <div className="relative w-full h-185 overflow-hidden">
        <img
          src={homeimage}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: "auto" }}
        />
        <div className="absolute inset-0 flex items-center justify-evenly gap-20 w-full h-full">
          {/* Headings */}
          <div className="flex flex-col items-start justify-center flex-1 ml-20">
            <h1
              className="text-3xl md:text-5xl font-bold drop-shadow-lg text-left"
              style={{
                color: "#FF5D00",
                WebkitTextStroke: "1px white",
                fontSize: 75,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              PREPARE WITH PURPOSE
            </h1>
            <h1
              className="text-3xl md:text-5xl font-bold drop-shadow-lg text-left"
              style={{
                color: "#FF5D00",
                WebkitTextStroke: "1px white",
                fontSize: 75,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              PERFORM WITH PRIDE
            </h1>
            <h1
              className="text-3xl md:text-5xl font-bold drop-shadow-lg text-left"
              style={{
                color: "#FF5D00",
                WebkitTextStroke: "1px white",
                fontSize: 75,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              SERVE WITH COURAGE
            </h1>
            <h1
              className="text-3xl md:text-5xl font-bold drop-shadow-lg text-left"
              style={{
                color: "#FF5D00",
                WebkitTextStroke: "1px white",
                fontSize: 75,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              <Typewriter
                words={["STAND WITH STRIDE..."]}
                loop={false}
                cursor
                cursorStyle="."
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </h1>
          </div>

          {/* User Count */}
          <div
            className="flex items-center justify-center ml-10"
            style={{
              height: "55px",
              width: "150px",
              marginRight: "150px",
              backgroundColor: "white",
            }}
          >
            <h3>{userCount} Users</h3>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "500px",
          backgroundColor: "#D7F1FF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "88px",
          paddingRight: "88px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "60px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bolder",
              background:
                "linear-gradient(to right, #CCCCCC 0%, #8C8C8C 13%, #666666 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              marginBottom: "30px",
            }}
          >
            Why Prasikshan ?
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "60px",
            marginBottom: "30px",
          }}
        >
          <SmallCardHome
            name={"Ananya Sharma"}
            title={"NDA Aspirant"}
            text={
              "The structured approach and mentorship provided here truly made a difference. I was able to identify my weak areas early and improve steadily. The one-on-one feedback sessions felt just like real SSB interviews!"
            }
          />
          <SmallCardHome
            name={"Rohan Thapa"}
            title={"CDS Aspirant"}
            text={
              "This platform is exactly what I needed. The mock tests and interview tips gave me real insight into the SSB process, and I felt confident walking into the screening round. The personalized guidance and realistic scenarios helped me overcome my nervousness."
            }
          />

          <SmallCardHome
            name={"Vikram Singh"}
            title={"AFCAT Candidate"}
            text={
              "I had attempted the SSB before, but this platform helped me understand what I was missing. The mock GTO tasks and psychology practice gave me a new level of confidence and clarity. Highly recommended!"
            }
          />
        </div>
      </div>

      <div
        style={{
          height: "280px",
          backgroundColor: "#EDF9FF",
          display: "flex",
          alignContent: "center",
          justifyContent: "space-around",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // backgroundColor: "red",
              // paddingLeft: "100px",
              paddingTop: "60px",
              paddingBottom: "100px",
              gap: "10px",
            }}
          >
            <h1
              style={{
                Color: "#716262",
                fontSize: "50px",
                fontWeight: "bolder",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Quick-Quiz
            </h1>
            <div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "25px",
                }}
              >
                Show Us You're SSB-Ready.
              </h3>
              <h6
                style={{
                  fontWeight: 500,
                  fontSize: "20px",
                }}
              >
                Every question brings you one step closer to the uniform.
              </h6>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            // backgroundColor: "red",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <button
            style={{
              backgroundColor: "#241F1F",
              color: "white",
              paddingLeft: "28px",
              paddingRight: "28px",
              paddingTop: "18px",
              paddingBottom: "18px",
              borderRadius: "10px",
              fontWeight: 700,
              fontFamily: "Poppins",
              transition: "transform 0.2s ease-in-out", // smooth transition
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => navigate("/fivequestion")}
          >
            5 Question
          </button>
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              paddingLeft: "25px",
              paddingRight: "25px",
              paddingTop: "15px",
              paddingBottom: "15px",
              borderRadius: "10px",
              fontWeight: 700,
              border: "3px solid black",
              transition: "transform 0.2s ease-in-out", // smooth hover transition
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => navigate("/tenquestion")}
          >
            10 Question
          </button>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}

export default Home;
