import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx";
import LoginHeader from "../Header/LoginHeader.jsx";

function Layout() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // if token exist in local storage then this 
    const token = localStorage.getItem("token");
    setIsSignedIn(!!token); 
  }, [isSignedIn]);

  return (
    <>
      {isSignedIn ? <LoginHeader /> : <Header />}
      <div style={{ marginTop: "60px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
