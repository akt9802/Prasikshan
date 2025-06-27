import React, { useState } from "react";
import homeimage from "../../assets/home-image-logo.jpg";
import { Typewriter } from "react-simple-typewriter";

function Home() {
  const [userCount, setuserCount] = useState(0);
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
          <div className="flex flex-col items-start justify-center flex-1 ml-12">
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
        className="why-prasikshan"
        style={{
          height: "500px",
          backgroundColor: "#D7F1FF",
          display: "flex",
        }}
      >
        <div>
            <h1>Why Prasikshan ?</h1>
        </div>
      </div>
    </>
  );
}

export default Home;
