// components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx"; 
import LoginHeader from "../Header/LoginHeader.jsx";
function Layout() {
  return (
    <>
      <LoginHeader />
      <div style={{ marginTop: "60px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
