// App.js
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./components/Home/Home.jsx";
import AboutSSB from "./components/About/AboutSSB.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/aboutssb" element={<AboutSSB />} />
      </Route>
    </Routes>
  );
}

export default App;
