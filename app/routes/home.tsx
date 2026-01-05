"use client";

import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";

import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/putter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";


import TextType from "~/components/TextType/TextType";
import ClickSpark from "~/components/ClickSpark/ClickSpark";


export function meta({ }: Route.MetaArgs) {
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
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);


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

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = await kv.list('resume:*', true) as KVItem[];
      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))



      console.log(parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false)
    }
    loadResumes();

  }, [])



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
            {!loadingResumes && resumes?.length == 0 ? (
              <h2 className="text-9xl font-bold">
                No Resumes found. Upload your First resume to get Feedback.
              </h2>
            ) : (
              <h2 className="text-9xl font-bold">
                Review Your submission and check AI-Powered Industry Feedback
              </h2>
            )}

            {loadingResumes && (
              <div className="flex flex-col items-center justify-center">
                <img src="/images/resume-scan-2.gif" className="w-[200px]" />
              </div>
            )}
          </div>

          {!loadingResumes && resumes.length > 0 && ( // ✅ Fixed: 'resumes' not 'resume'
            <div className="resume-section grid grid-cols-3 gap-15">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

         {!loadingResumes && resumes?.length==0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">

              <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                Upload Resume
              </Link>
          </div>
         )}
      </section>


    </ClickSpark>
    </main >
  );
}
