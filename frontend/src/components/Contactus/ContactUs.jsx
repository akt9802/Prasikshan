import React from "react";
import contactusimage from "..//..//assets/contact-us/contactimage.jpg";
import Footer from "..//Footer/Footer.jsx";

function ContactUs() {
  return (
    <>
      <div
        style={{
          display: "flex",
          paddingLeft: "200px",
          paddingRight: "200px",
          justifyContent: "space-between",
          paddingTop: "30px",
          paddingBottom: "30px",
          background: "linear-gradient(to bottom, #D7F1FF 0%, #62B5E2 100%)",
        }}
      >
        <div class="side-image" style={{}}>
          <div>
            <img
              src={contactusimage}
              alt=""
              height="750px"
              width="456px"
              style={{
                border: "30px solid #EDF9FF",
              }}
            />
          </div>
        </div>
        <div
          class="contact-us"
          style={{
            height: "555px",
            width: "480px",
            border: "1px solid black", // to match the image styling
            boxSizing: "border-box", // ensures border is included in the total size

            paddingLeft: "30px",
            paddingRight: "30px",
            borderRadius: "10px",
            backgroundColor: "#D7F1FF",
          }}
        >
          <div style={{}}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
              }}
            >
              <h1
                style={{
                  fontSize: "50px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  // color: "linear-gradient(to right, #000000, #998d8d)",
                  // WebkitTextStroke: "1px black", // stroke width and color
                  background:
                    "linear-gradient(to right, #000000 0%, #967A7A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Contact Us
              </h1>
            </div>
            <div
              style={
                {
                  // backgroundColor: "red",
                }
              }
            >
              <h1>Name :</h1>
              <input
                type="text"
                style={{
                  border: "2px solid black",
                  width: "100%",
                  padding: "5px",
                  boxSizing: "border-box",
                  borderRadius: "5px",
                }}
                placeholder="Enter your name...."
              />
            </div>
            <div
              style={
                {
                  // backgroundColor: "red",
                }
              }
            >
              <h1>Email :</h1>
              <input
                type="Email:"
                style={{
                  border: "2px solid black",
                  width: "100%",
                  padding: "5px",
                  boxSizing: "border-box",
                  borderRadius: "5px",
                }}
                placeholder="Enter your email...."
              />
            </div>
            <div>
              <h1>Query :</h1>
              <textarea
                style={{
                  border: "2px solid black",
                  width: "100%",
                  height: "250px",
                  resize: "none", // optional: prevent resizing
                  padding: "10px", // optional: for better UX
                  boxSizing: "border-box", // ensures padding is within width
                  borderRadius: "5px",
                }}
                placeholder="Enter your query here... "
              ></textarea>
            </div>
          </div>
          <button
            style={{
              border: "1px solid black",
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default ContactUs;
