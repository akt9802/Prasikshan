'use client';
import React from "react";
import Image from "next/image";
import { Montserrat } from 'next/font/google';
import Footer from "../footer/Footer";
import indiaMap from "@/assets/india-map.svg";

const montserrat = Montserrat({ subsets: ['latin'] });

function AboutSSB() {
  const images = [
    "/about-ssb-images/pop.jpeg",
    "/about-ssb-images/img2.jpeg",
    "/about-ssb-images/img3.jpeg",
    "/about-ssb-images/img4.jpeg",
    "/about-ssb-images/img5.jpeg",
    "/about-ssb-images/img6.jpeg",
    "/about-ssb-images/img7.jpeg",
    "/about-ssb-images/img8.jpeg",
  ];

  const ssbCenters = [
    // Approximate positions tuned visually for the SVG map
    { name: "SSB Kapurthala", top: "24%", left: "31%" },
    { name: "SSB Allahabad", top: "44%", left: "54%" },
    { name: "SSB Varanasi", top: "47%", left: "60%" },
    { name: "SSB Bhopal", top: "56%", left: "50%" },
    { name: "SSB Bangalore", top: "70%", left: "48%" },
    { name: "SSB Coimbatore", top: "80%", left: "50%" },
  ];

  return (
    <>
      <div className="image-carousel">
        <div className="slider-track">
          {images.concat(images).map((img, index) => (
            <div className="slide" key={index}>
              <Image src={img} alt={`Slide ${index}`} width={400} height={220} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#EDF9FF] flex flex-col md:flex-row justify-around items-center p-10 md:p-12 gap-12 md:gap-24">
        <div className="flex flex-col w-full md:w-[650px] gap-8">
          <h1 style={{ fontSize: "60px", fontWeight: 750, background: "linear-gradient(to right, #000000 0%, #967A7A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }} className={`${montserrat.className} bg-clip-text`}>
            What is SSB ?
          </h1>
          <h3 style={{ fontWeight: 500, fontFamily: "Poppins, sans-serif", lineHeight: "1.5", margin: 0 }} className="text-lg md:text-xl text-gray-700">
            SSB stands for Services Selection Board. It is a 5-day assessment
            process conducted by the Indian Armed Forces to evaluate candidates
            on mental, physical, and psychological grounds for officer-level
            entry.
          </h3>
        </div>
        <div>
          <Image
            src="/about-ssb-images/trio.png"
            alt="SSB Trio"
            width={320}
            height={320}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#D7F1FF] to-[#62B5E2] py-10">
        <div className="ssb-container">
          <h1 className={`${montserrat.className} ssb-heading pb-2`}>SSB 5-Day Selection Process</h1>
          <div className="ssb-timeline">
            {/* Day 1 */}
            <div className="ssb-row">
              <div className="ssb-hover-wrapper">
                <div className="ssb-card-left">
                  <h3 className={montserrat.className}>Day - 1</h3>
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
                  <h3 className={montserrat.className}>Day – 2</h3>
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
                  <h3 className={montserrat.className}>Day – 3</h3>
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
                  <h3 className={montserrat.className}>Day – 4</h3>
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
                  <h3 className={montserrat.className}>Day – 5</h3>
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

      <div className="bg-[#EDF9FF] pb-12 px-4 flex flex-col items-center">
        <h1
          style={{
            fontSize: "60px",
            fontWeight: 800,
            textAlign: "center",
            paddingTop: "20px",
            background: "linear-gradient(to right, #000000, #998d8d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          className={`${montserrat.className} bg-clip-text`}
        >
          SSB Centres
        </h1>

        <div className="mt-8 w-full max-w-3xl">
          <div className="relative w-full aspect-square mx-auto">
            <Image
              src={indiaMap}
              alt="Map of India showing SSB Centres"
              fill
              className="object-contain drop-shadow-md"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />

            {ssbCenters.map((center) => (
              <button
                key={center.name}
                type="button"
                className="group absolute flex flex-col items-center"
                style={{
                  top: center.top,
                  left: center.left,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <span className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-red-500 border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-150" />
                <span className="mt-1 px-2 py-1 rounded-full bg-white/90 text-[10px] sm:text-xs md:text-sm font-medium text-gray-800 shadow-md whitespace-nowrap">
                  {center.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutSSB;
