import React, {type FormEvent, useEffect, useRef, useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/putter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2image";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

function upload() {
    const {auth,isLoading,fs,ai,kv}=usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');

    const handleAnalyzer=async({companyName,jobTitle,jobDescription,file}:{companyName:string,jobTitle:string,jobDescription:string,file:File})=>{
            setIsProcessing(true);
            setStatusText('Uploading...');
            const uploadedFile=await fs.upload([file]);

            if(!uploadedFile) return setStatusText('Failed to upload');

            setStatusText('Converting into image...');
            const imageFile=await convertPdfToImage(file);

            if(!imageFile.file) return setStatusText('Failed to convert PDF to  image...');
            setStatusText('Uploading the image...');

            const uploadedImage=await fs.upload([imageFile.file]);
            if(!uploadedImage) return setStatusText('Failed to upload Image...');

            setStatusText('Preparing Data...');

            const uuid=generateUUID();
            const data={
                id:uuid,
                resumePath:uploadedFile.path,
                imagePath:uploadedImage.path,
                companyName,jobTitle,jobDescription,
                feedback:'',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');


        const feedback=await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle,jobDescription})
        )
        if(!feedback) return setStatusText('Failed to analyze resume...');

        const feedbackText=typeof feedback.message.content==='string'?
            feedback.message.content: feedback.message.content[0].text

        data.feedback=JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis completed,redirecting... ');

        console.log(data);
    }


    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form=e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);


        const companyName=formData.get('company-name') as string;
        const jobTitle=formData.get('job-title') as string;
        const jobDescription=formData.get('job-description') as string;

       if(!file) return;

       handleAnalyzer({companyName,jobTitle,jobDescription,file})
    }

    const [file, setFile] = useState< File |null>(null);

    const handeFileSelect = (file: File | null) => {
        setFile(file);
    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section ">
                <div className="page-heading py-16">
                    <h1 className="text-3xl font-bold">Smart Feedback for your Dream Job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif " alt="resumeimages" className="w-full"/>
                        </>
                    ):(
                        <h2>Drop Your Resume for an ATS Score and Improvement Tips</h2>
                    )}
                    {!isProcessing && (
                        <form  id="upload-form" onSubmit={handleSubmit} className="flex flex-col justify-center gap-4 mt-8 font-bold text-2xl">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Enter Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={8} name="job-description" placeholder="Enter Job Description" id="job-description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <div className="w-full">
                                    <FileUploader onFileSelect={handeFileSelect} />
                                </div>

                            </div>

                            <button type="submit" className="primary-button fade-in duration-1000 hover:backdrop-blur-none">Analyze Resume </button>

                        </form>
                    )}
                </div>
            </section>
            </main>
    );
}

export default upload