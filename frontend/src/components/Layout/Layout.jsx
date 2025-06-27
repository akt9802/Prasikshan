// components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx"; 

function Layout() {
  return (
    <>
      <Header />
      <div style={{ marginTop: "60px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
