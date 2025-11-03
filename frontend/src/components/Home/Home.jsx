import React from "react";
import homeimage from "../../assets/home-image-logo.jpg";
import { Typewriter } from "react-simple-typewriter";
import SmallCardHome from "./small-card-home";
import Footer from "../Footer/Footer.jsx";

import { useNavigate } from "react-router-dom";

function Home() {
  // const [userCount, setuserCount] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[750px] overflow-hidden">
        <img
          src={homeimage}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: "auto" }}
        />
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-evenly gap-8 w-full h-full p-4">
          {/* Headings */}
          <div className="flex flex-col items-start justify-center flex-1 text-center md:text-left md:ml-20">
            {[
              "PREPARE WITH PURPOSE",
              "PERFORM WITH PRIDE",
              "SERVE WITH COURAGE",
            ].map((line, idx) => (
              <h1
                key={idx}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold drop-shadow-lg"
                style={{
                  color: "#FF5D00",
                  WebkitTextStroke: "0px white",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {line}
              </h1>
            ))}
            <h1
              className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold drop-shadow-lg"
              style={{
                color: "#FF5D00",
                WebkitTextStroke: "0px white",
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
        </div>
      </div>

      <div className="bg-[#D7F1FF] flex flex-col items-center justify-center px-4 md:px-10 py-12">
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
          style={{
            fontFamily: "Montserrat, sans-serif",
            background:
              "linear-gradient(to right, #CCCCCC 0%, #8C8C8C 13%, #666666 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Why Prashikshan ?
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-center">
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

      <div className="bg-[#EDF9FF] flex flex-col lg:flex-row items-center justify-between px-4 md:px-21 py-10 gap-8">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Quick-Quiz
          </h1>
          <h3 className="font-semibold text-xl">Show Us You're SSB-Ready.</h3>
          <h6 className="font-medium text-lg">
            Every question brings you one step closer to the uniform.
          </h6>
        </div>

        <div className="flex gap-4">
          <button
            className="bg-black text-white py-3 px-6 rounded-lg font-bold transition-transform duration-200 hover:scale-105"
            onClick={() => navigate("/fivequestion")}
          >
            5 Question
          </button>
          <button
            className="bg-white text-black py-3 px-6 border-2 border-black rounded-lg font-bold transition-transform duration-200 hover:scale-105"
            onClick={() => navigate("/tenquestion")}
          >
            10 Question
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
