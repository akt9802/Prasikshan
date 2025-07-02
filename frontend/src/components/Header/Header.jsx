import React from "react";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import AboutSSB from "../About/AboutSSB.jsx";
function Header() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: 60,
        backgroundColor: "#124D96",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        paddingLeft: "88px",
        paddingRight: "88px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
      }}
    >
      <div
        style={{
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <h1 className="font-bold">Prasikshan</h1>
      </div>
      <div
        className="font-light flex gap-6"
        style={{
          fontSize: "14px",
          alignItems: "center",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/aboutssb">About SSB</Link>
        <Link to="/contactus">Contact Us</Link>
        <div style={{ alignItems: "center" }}>
          <button
            style={{
              backgroundColor: "#00FF11",
              borderRadius: "5px",
              color: "black",
            }}
            className="px-5 py-1.5 font-semibold"
            onClick={() => navigate("/alltest")}
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
