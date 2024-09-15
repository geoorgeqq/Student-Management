import { About } from "./../components/About";
import { Footer } from "../components/Footer";
import { Hero } from "./../components/Hero";
import { Navbar } from "./../components/Navbar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  loggedIn: boolean;
  email: string;
  handleLoginLogout: () => void;
}

export const HomePage = ({
  loggedIn,
  email,
  handleLoginLogout,
}: HomePageProps) => {
  return (
    <>
      <Navbar loggedIn={loggedIn} onLoginLogout={handleLoginLogout} />
      <Hero />
      <About />
      <Footer />
    </>
  );
};
