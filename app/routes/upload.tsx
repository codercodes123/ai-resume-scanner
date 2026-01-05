import React, { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/putter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { runMultiAIFeedback } from "~/lib/multiAiFeedback";
import ClickSpark from "~/components/ClickSpark/ClickSpark";


function Upload() {
    const { fs, ai, kv, auth } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleAnalyzer = async ({
        companyName,
        jobTitle,
        jobDescription,
        file,
    }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);
            console.clear();
            console.log("%c--- RESUME ANALYZER START ---", "color: orange; font-weight: bold;");
            console.log("Auth:", auth);

            setStatusText("Uploading resume...");
            const uploadedFile = await fs.upload([file]);
            console.log("Uploaded resume result:", uploadedFile);

            if (!uploadedFile?.path) throw new Error("❌ Failed to upload resume");

            setStatusText("Converting PDF to image...");
            const imageFile = await convertPdfToImage(file);
            console.log("PDF → Image result:", imageFile);
            if (!imageFile?.file) throw new Error("❌ Failed to convert PDF to image");

            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([imageFile.file]);
            console.log("Uploaded image result:", uploadedImage);
            if (!uploadedImage?.path) throw new Error("❌ Failed to upload image");

            setStatusText("Preparing data...");
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "" as any,
            };
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            console.log("KV stored initial data:", data);

            // ---- MULTI-AI FEEDBACK SECTION ----
            // Runs 4 AI perspectives in parallel and combines results:
            // - ATS Scanner (35%): Keyword optimization, formatting
            // - Recruiter (25%): Human readability, career narrative
            // - Hiring Manager (25%): Role fit, impact, seniority
            // - Language (15%): Grammar, clarity, tone
            console.log("%c--- MULTI-AI ANALYSIS START ---", "color: cyan; font-weight: bold;");
            
            let feedback: any;
            try {
                // Get Puter instance for direct AI calls
                const puter = (window as any).puter;
                if (!puter) throw new Error("Puter not available");

                feedback = await runMultiAIFeedback(
                    puter,
                    uploadedFile.path,
                    jobTitle,
                    jobDescription,
                    setStatusText // Progress callback
                );
                
                console.log("Combined AI feedback:", feedback);
            } catch (err: any) {
                console.error("Multi-AI analysis failed:", err);
                
                // Fallback to single AI if multi-AI fails
                console.log("Falling back to single AI analysis...");
                setStatusText("Analyzing resume...");
                
                const { prepareInstructions } = await import("../../constants");
                const prompt = prepareInstructions({ jobTitle, jobDescription });
                feedback = await ai.feedback(uploadedFile.path, prompt);
            }

            if (!feedback) {
                console.error("No feedback returned from AI");
                throw new Error("No feedback received from AI.");
            }

            // Validate feedback has required structure
            if (
                typeof feedback.overallScore !== "number" ||
                !feedback.ATS ||
                !feedback.toneAndStyle ||
                !feedback.content ||
                !feedback.structure ||
                !feedback.skills
            ) {
                console.error("Feedback missing required fields:", feedback);
                throw new Error("AI feedback is incomplete.");
            }

            // Store the complete Feedback object
            data.feedback = feedback;
            console.log("%c--- FINAL FEEDBACK ---", "color: green; font-weight: bold;");
            console.log("Overall Score:", feedback.overallScore);
            console.log("ATS Score:", feedback.ATS.score);
            console.log("Tone & Style:", feedback.toneAndStyle.score);
            console.log("Content:", feedback.content.score);
            console.log("Structure:", feedback.structure.score);
            console.log("Skills:", feedback.skills.score);

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            console.log("Final KV data saved with feedback");

            setStatusText("Analysis completed, redirecting...");
            navigate(`/resume/${uuid}`);
        } catch (error: any) {
            console.error("💥 Analyzer error:", error);
            setStatusText(error.message || "Something went wrong while analyzing");
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;

        const formData = new FormData(form);
        const companyName = (formData.get("company-name") as string) || "";
        const jobTitle = (formData.get("job-title") as string) || "";
        const jobDescription = (formData.get("job-description") as string) || "";

        if (!file) {
            setStatusText("Please upload a resume first");
            return;
        }

        handleAnalyzer({ companyName, jobTitle, jobDescription, file });
    };

    const handleFileSelect = (file: File | null) => setFile(file);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <ClickSpark
                sparkColor="#271e37"
                sparkSize={10}
                sparkRadius={25}
                sparkCount={8}
                duration={400}
            >
                <Navbar />
                

                <section className="main-section">
                    <div className="page-heading py-16">
                        <h1 className="text-3xl font-bold">Smart Feedback for your Dream Job</h1>

                        {isProcessing ? (
                            <>
                                <h2>{statusText}</h2>
                                <img
                                    src="/images/resume-scan.gif"
                                    alt="resume scanning"
                                    className="w-full"
                                />
                            </>
                        ) : (
                            <h2>Drop Your Resume for an ATS Score and Improvement Tips</h2>
                        )}

                        {!isProcessing && (
                            <form
                                id="upload-form"
                                onSubmit={handleSubmit}
                                className="flex flex-col justify-center gap-4 mt-8 font-bold text-2xl"
                            >
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input
                                        type="text"
                                        name="company-name"
                                        placeholder="Company Name"
                                        id="company-name"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input
                                        type="text"
                                        name="job-title"
                                        placeholder="Enter Job Title"
                                        id="job-title"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea
                                        rows={8}
                                        name="job-description"
                                        placeholder="Enter Job Description"
                                        id="job-description"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <div className="w-full">
                                        <FileUploader onFileSelect={handleFileSelect} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="primary-button fade-in duration-1000 hover:backdrop-blur-none"
                                >
                                    Analyze Resume
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </ClickSpark>
        </main>
    );
}

export default Upload;
