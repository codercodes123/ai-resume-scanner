export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Software Engineer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 78,
            ATS: { score: 85, tips: [] },
            toneAndStyle: { score: 80, tips: [] },
            content: { score: 75, tips: [] },
            structure: { score: 82, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 72,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Engineer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 80,
            ATS: { score: 88, tips: [] },
            toneAndStyle: { score: 92, tips: [] },
            content: { score: 78, tips: [] },
            structure: { score: 86, tips: [] },
            skills: { score: 84, tips: [] },
        },
    },
    {
        id: "4",
        companyName: "Netflix",
        jobTitle: "Full Stack Engineer",
        imagePath: "/images/resume_04.png",
        resumePath: "/resumes/resume-4.pdf",
        feedback: {
            overallScore: 76,
            ATS: { score: 82, tips: [] },
            toneAndStyle: { score: 84, tips: [] },
            content: { score: 79, tips: [] },
            structure: { score: 88, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "5",
        companyName: "IBM",
        jobTitle: "Machine Learning Engineer",
        imagePath: "/images/resume_05.png",
        resumePath: "/resumes/resume-5.pdf",
        feedback: {
            overallScore: 82,
            ATS: { score: 92, tips: [] },
            toneAndStyle: { score: 85, tips: [] },
            content: { score: 79, tips: [] },
            structure: { score: 87, tips: [] },
            skills: { score: 94, tips: [] },
        },
    },
    {
        id: "6",
        companyName: "Tesla",
        jobTitle: "Embedded Systems Engineer",
        imagePath: "/images/resume_05.svg",
        resumePath: "/resumes/resume-6.pdf",
        feedback: {
            overallScore: 74,
            ATS: { score: 86, tips: [] },
            toneAndStyle: { score: 80, tips: [] },
            content: { score: 70, tips: [] },
            structure: { score: 85, tips: [] },
            skills: { score: 88, tips: [] },
        },
    },
    {
        id: "7",
        companyName: "Meta",
        jobTitle: "Backend Engineer",
        imagePath: "/images/resume_07.png",
        resumePath: "/resumes/resume-7.pdf",
        feedback: {
            overallScore: 79,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 82, tips: [] },
            content: { score: 74, tips: [] },
            structure: { score: 80, tips: [] },
            skills: { score: 93, tips: [] },
        },
    },
    {
        id: "8",
        companyName: "SpaceX",
        jobTitle: "Systems Engineer",
        imagePath: "/images/resume_08.png",
        resumePath: "/resumes/resume-8.pdf",
        feedback: {
            overallScore: 81,
            ATS: { score: 88, tips: [] },
            toneAndStyle: { score: 84, tips: [] },
            content: { score: 79, tips: [] },
            structure: { score: 89, tips: [] },
            skills: { score: 90, tips: [] },
        },
    },
    {
        id: "9",
        companyName: "Amazon",
        jobTitle: "DevOps Engineer",
        imagePath: "/images/resume_09.png",
        resumePath: "/resumes/resume-9.pdf",
        feedback: {
            overallScore: 75,
            ATS: { score: 93, tips: [] },
            toneAndStyle: { score: 80, tips: [] },
            content: { score: 72, tips: [] },
            structure: { score: 85, tips: [] },
            skills: { score: 92, tips: [] },
        },
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription,
                                        AIResponseFormat,
                                    }: {
    jobTitle: string;
    jobDescription: string;
    AIResponseFormat: string;
}) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;