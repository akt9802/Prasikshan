import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx";
import LoginHeader from "../Header/LoginHeader.jsx";

function Layout() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // set initial signed-in state on mount
    const token = localStorage.getItem("token");
    setIsSignedIn(!!token);

    // listen for auth changes (signin/signout) and update header reactively
    const onAuthChange = () => {
      const t = localStorage.getItem("token");
      setIsSignedIn(!!t);
    };

    window.addEventListener("auth-change", onAuthChange);
    return () => window.removeEventListener("auth-change", onAuthChange);
  }, []);

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
