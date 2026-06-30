import { useState } from "react";
import "./App.css";
import Header from "./Components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router";
import Hero from "./Components/Hero/Hero";
import Info from "./Components/Info/Info";
import InfoBox from "./Components/InfoBox/InfoBox";
import Agenda from "./Components/Agenda/Agenda";
import Map from "./Components/Map/Map";
import Footer from "./Components/Footer/Footer";
import Register from "./Components/Register/Register";
import Admin from "./Dashboard/Admin/Admin";
import Splash from "./Components/Splash/Splash";
import { useEffect } from "react";

function App() {
  const [openregister, setopenregister] = useState(false);
  const [loading, setloading] = useState(true);

  const handleregister = () => {
    setopenregister(true);
  };
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 300);
  }, [])
  return (
    <BrowserRouter>
      {loading && <Splash />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header openregister={handleregister} />
              <Hero openregister={handleregister} />
              <Info openregister={handleregister} />
              <Register open={openregister} onClose={() => setopenregister(false)} />
              <InfoBox />
              <Agenda />
              <Map />
              <Footer />
            </>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
