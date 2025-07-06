import React from "react";
import "./AboutSSB.css";
import "./SSBProcess.css";
import popImg from "../../assets/about-ssb-images/pop.jpeg";
import img2 from "../../assets/about-ssb-images/img2.jpeg";
import img3 from "../../assets/about-ssb-images/img3.jpeg";
import img4 from "../../assets/about-ssb-images/img4.jpeg";
import img5 from "../../assets/about-ssb-images/img5.jpeg";
import img6 from "../../assets/about-ssb-images/img6.jpeg";
import img7 from "../../assets/about-ssb-images/img7.jpeg";
import img8 from "../../assets/about-ssb-images/img8.jpeg";
import trio from "../../assets/about-ssb-images/trio.png";
import ssba from "../../assets/ssb-images/ssb-a.jpg";
import ssbb from "../../assets/ssb-images/ssbb.jpg";
import ssbbg from "../../assets/ssb-images/ssbbg.jpeg";
import ssbk from "../../assets/ssb-images/ssbk.jpg";
import ssbc from "../../assets/ssb-images/ssbc.jpg"
import ssbv from "../../assets/ssb-images/ssbv.jpg"
import Footer from "../Footer/Footer.jsx";
function AboutSSB() {
  const images = [popImg, img2, img3, img4, img5, img6, img7, img8];
  return (
    <>
      <div className="image-carousel">
        <div className="slider-track">
          {images.concat(images).map((img, index) => (
            <div className="slide" key={index}>
              <img src={img} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#EDF9FF",
          // height: "380px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center", // Center vertically
          padding: "40px 50px", // Optional horizontal padding
          gap: "100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "650px",
            gap: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 750,
              background: "linear-gradient(to right, #000000 0%, #967A7A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            What is SSB ?
          </h1>
          <h3
            style={{
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            SSB stands for Services Selection Board. It is a 5-day assessment
            process conducted by the Indian Armed Forces to evaluate candidates
            on mental, physical, and psychological grounds for officer-level
            entry.
          </h3>
        </div>

        <div>
          <img
            src={trio}
            alt="SSB Trio"
            style={{
              width: "320px",
              height: "auto", // Maintain aspect ratio
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(to bottom, #D7F1FF, #62B5E2)",
        }}
      >
        <div className="ssb-container">
          <h1 className="ssb-heading" style={{
            paddingBottom: "10px"
          }}>SSB 5-Day Selection Process</h1>
          <div className="ssb-timeline">
            {/* Day 1 */}
            <div className="ssb-row">
              <div className="ssb-hover-wrapper">
                <div className="ssb-card-left">
                  <h3>Day - 1</h3>
                  <p>
                    Screening Test
                    <br />
                    OIR + PPDT
                  </p>
                </div>
                <div className="ssb-detail left">
                  <p>
                    <strong>OIR:</strong> Officer Intelligence Rating Test
                    <br />
                    <strong>PPDT:</strong> Picture Perception and Discussion
                    Test
                    <br />
                    Conducted to screen candidates for psychological and
                    physical tests.
                  </p>
                </div>
              </div>
              <div className="ssb-line"></div>
              <div></div>
            </div>

            {/* Day 2 */}
            <div className="ssb-row">
              <div></div>
              <div className="ssb-line"></div>
              <div className="ssb-hover-wrapper">
                <div className="ssb-card-right">
                  <h3>Day – 2</h3>
                  <p>
                    Psychological Tests
                    <br />
                    TAT, WAT, SRT, SDT
                  </p>
                </div>
                <div className="ssb-detail right">
                  <p>
                    <strong>TAT:</strong> Thematic Apperception Test
                    <br />
                    <strong>WAT:</strong> Word Association Test
                    <br />
                    <strong>SRT:</strong> Situation Reaction Test
                    <br />
                    <strong>SDT:</strong> Self Description Test
                  </p>
                </div>
              </div>
            </div>

            {/* Day 3 */}
            <div className="ssb-row">
              <div className="ssb-hover-wrapper">
                <div className="ssb-card-left">
                  <h3>Day – 3</h3>
                  <p>
                    Group Tasks – Part 1<br />
                    GD, GPE, PGT
                  </p>
                </div>
                <div className="ssb-detail left">
                  <p>
                    <strong>GD:</strong> Group Discussion
                    <br />
                    <strong>GPE:</strong> Group Planning Exercise
                    <br />
                    <strong>PGT:</strong> Progressive Group Task
                  </p>
                </div>
              </div>
              <div className="ssb-line"></div>
              <div></div>
            </div>

            {/* Day 4 */}
            <div className="ssb-row">
              <div></div>
              <div className="ssb-line"></div>
              <div className="ssb-hover-wrapper">
                <div className="ssb-card-right">
                  <h3>Day – 4</h3>
                  <p>
                    Group Tasks – Part 2<br />
                    Lecturrette, CT, IT
                  </p>
                </div>
                <div className="ssb-detail right">
                  <p>
                    <strong>Lecturrette:</strong> Short topic speech
                    <br />
                    <strong>CT:</strong> Command Task
                    <br />
                    <strong>IT:</strong> Individual Obstacles
                  </p>
                </div>
              </div>
            </div>

            {/* Day 5 */}
            <div className="ssb-row">
              <div className="ssb-hover-wrapper">
                <div className="ssb-card-left">
                  <h3>Day – 5</h3>
                  <p>Conference</p>
                </div>
                <div className="ssb-detail left">
                  <p>
                    The final day where assessors discuss the candidate’s
                    overall performance and decide the result.
                  </p>
                </div>
              </div>
              <div className="ssb-line"></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#EDF9FF",
          paddingBottom: "15px",
        }}
      >
        <div
          style={
            {
              // marginBottom: "2"
            }
          }
        >
          <h1
            style={{
              fontSize: "60px",
              fontWeight: 800,
              fontFamily: "Montserrat, sans-serif",
              textAlign: "center",
              paddingTop: "20px",
              background: "linear-gradient(to right, #000000, #998d8d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              // display: "inline-block",\
            }}
          >
            SSB Centres
          </h1>
        </div>
        <div
          className="ssb-grid"
          style={
            {
              // marginTop: "1px"
            }
          }
        >
          {[
            { name: "SSB Allahabad", src: ssba },
            { name: "SSB Bhopal", src: ssbb },
            { name: "SSB Bangalore", src: ssbbg },
            { name: "SSB Kapurthala", src: ssbk },
            { name: "SSB Coimbatore", src: ssbc },
            { name: "SSB Varanasi", src: ssbv },
          ].map((item, index) => (
            <div className="ssb-card" key={index}>
              <img src={item.src} alt={item.name} className="ssb-img" />
              <h3 className="ssb-title">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutSSB;
