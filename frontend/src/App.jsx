// App.js
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./components/Home/Home.jsx";
import AboutSSB from "./components/About/AboutSSB.jsx";
import Alltest from "./components/Alltest/Alltest.jsx";
import ContactUs from "./components/Contactus/SupportUs.jsx";
import FiveQuestion from "./components/Home/FiveQuestion.jsx";
import DisplayFiveQuestion from "./components/Home/DisplayFiveQuestion.jsx";
import TenQuestion from "./components/Home/TenQuestion.jsx";
import DisplayTenQuestion from "./components/Home/DisplayTenQuestion.jsx";
import OirInstruction from "./components/OIR/OirInstruction.jsx";
import DisplayOirQuestion from "./components/OIR/DisplayOirQuestion.jsx";
import PPDTinstruction from "./components/PPDT/PPDTinstruction.jsx";
import TATinstruction from "./components/TAT/TATinstruction.jsx";
import WATinstruction from "./components/WAT/WATinstruction.jsx";
import SRTinstruction from "./components/SRT/SRTinstruction.jsx";
import LECTURETTEinstruction from "./components/LECTURETTE/LECTURETTEinstruction.jsx";
import PIinstuction from "./components/PersonalInterview/PIinstuction.jsx";
import DisplayPPDTQuestion from "./components/PPDT/DisplayPPDTQuestion.jsx";
import DisplayWatQuestion from "./components/WAT/DisplayWatQuestion.jsx";
import DisplaySrtQuestion from "./components/SRT/DisplaySrtQuestion.jsx";
import DisplayLecturetteQuestion from "./components/LECTURETTE/DisplayLecturetteQuestion.jsx";
import DisplayPiQuestion from "./components/PersonalInterview/DisplayPiQuestion.jsx";
import DisplayTatQuestion from "./components/TAT/DisplayTatQuestion.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import SignupPage from "./components/LoginPage/SignupPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/aboutssb" element={<AboutSSB />} />
        <Route path="/alltest" element={<Alltest />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/fivequestion" element={<FiveQuestion />} />
        <Route
          path="/fivequestion/displayfivequestion"
          element={<DisplayFiveQuestion />}
        />
        <Route path="/tenquestion" element={<TenQuestion />} />
        <Route
          path="/tenquestion/displaytenquestion"
          element={<DisplayTenQuestion />}
        />
        <Route path="/alltest/oir" element={<OirInstruction />} />
        <Route
          path="/alltest/oir/displayoirquestions"
          element={<DisplayOirQuestion />}
        />

        <Route path="/alltest/ppdt" element={<PPDTinstruction />} />
        <Route path="/alltest/tat" element={<TATinstruction />} />
        <Route path="/alltest/wat" element={<WATinstruction />} />
        <Route path="/alltest/sat" element={<SRTinstruction />} />
        <Route path="/alltest/lecturette" element={<LECTURETTEinstruction />} />
        <Route path="/alltest/pi" element={<PIinstuction />} />

        <Route
          path="/alltest/ppdt/displayppdtquestion"
          element={<DisplayPPDTQuestion />}
        />
        <Route
          path="/alltest/wat/displaywatquestions"
          element={<DisplayWatQuestion />}
        />
        <Route
          path="/alltest/srt/displaysrtquestions"
          element={<DisplaySrtQuestion />}
        />
        <Route
          path="/alltest/lecturette/DisplayLecturetteQuestion"
          element={<DisplayLecturetteQuestion />}
        />
        <Route
          path="/alltest/pi/displaypiquestions"
          element={<DisplayPiQuestion />}
        />
        <Route
          path="/alltest/tat/displaytatquestions"
          element={<DisplayTatQuestion />}
        />

        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}

export default App;
