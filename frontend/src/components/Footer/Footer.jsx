import React from "react";
import instagramLogo from "../../assets/instagram.png";
import youtubeLogo from "../../assets/youtube.png";
import twitterLogo from "../../assets/twitter.png";
function Footer() {
  return (
    <div
      style={{
        // backgroundColor: "red",
        height: "120px",
        backgroundColor: "#124D96",
        display: "flex",
        justifyContent: "space-around",
        gap: "600px",
        alignItems: "center"
      }}
    >
      <div>
        <div style={{
            display: "flex",
            gap: "50px"
        }}>
          <h2
            style={{
              fontWeight: 600,
              color: "white",
            }}
          >
            Your trusted platform for SSB interview preparation.
          </h2>
        </div>
        <div>
          <h2
            style={{
              fontWeight: 200,
              color: "white",
            }}
          >
            © 2025 Prasikshan. All Rights Reserved.
          </h2>
        </div>
      </div>
      <div style={{
        display: "flex",
        gap: "20px"
      }}>
        <div>
          <img src={instagramLogo} alt="" width={50} height={50} />
        </div>
        <div>
          <img src={youtubeLogo} alt="" width={50} height={50} />
        </div>
        <div>
          <img src={twitterLogo} alt="" width={50} height={50} />
        </div>
      </div>
    </div>
  );
}

export default Footer;
