"use client";

import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/putter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";


import TextType from "~/components/TextType/TextType";
import ClickSpark from "~/components/ClickSpark/ClickSpark";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireNex" },
    {
      name: "description",
      content: "Believe in Your Resume as it defines WHO YOU ARE",
    },
  ];
}

export default function Home() {

  const store = usePuterStore();
  const navigate = useNavigate();

  // Debug: Check what's in the store
  console.log("Store state:", store);
  console.log("Auth object:", store?.auth);

  useEffect(() => {
    // Safety check
    if (!store || !store.auth) {
      console.error("Puter store or auth not available!");
      return;
    }

    console.log(
      "Home page auth check:",
      store.auth.isAuthenticated,
      typeof store.auth.isAuthenticated
    );

    if (!store.auth.isAuthenticated) {
      console.log("Redirecting to /auth");
      navigate("/auth?next=/");
    }
  }, [store?.auth?.isAuthenticated, navigate]);

  // Also fix the resumes bug:
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <ClickSpark
        sparkColor="#271e37"
        sparkSize={10}
        sparkRadius={35}
        sparkCount={12}
        duration={400}
      >
       
        {/* Hyperspeed background only in top section */}
        <div className="absolute -z-10"></div>

        <Navbar />
        
        <section className="main-section ">
          <div className="page-heading text-center py-16">
            <h1>
              <TextType
                text={["Welcome To HIRENEX "]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter=""
              />
            </h1>
            <h2 className="text-9xl font-bold">
              Track Your Applications and Resume Ratings
            </h2>
            <h2 className="text-gradient"></h2>
          </div>

          {resumes.length > 0 && ( // ✅ Fixed: 'resumes' not 'resume'
            <div className="resume-section grid grid-cols-3 gap-15">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
        </section>

      </ClickSpark>
    </main>
  );
}
