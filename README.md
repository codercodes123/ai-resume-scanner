# HIRENEX

**AI-Powered Resume Analysis & ATS Evaluation Platform**

HIRENEX is a web application that helps job seekers understand how their resumes perform against Applicant Tracking Systems (ATS) and receive actionable feedback to improve their chances of landing interviews.

🔗 **Live Demo:** [https://puter.com/app/hirenex-resume-analyzer](https://puter.com/app/hirenex-resume-analyzer)

---

## The Problem

Over 75% of resumes are rejected by ATS before a human ever sees them. Job seekers often have no visibility into:

- Whether their resume is ATS-compatible
- How their content, structure, and tone are perceived
- What specific improvements would increase their chances

HIRENEX solves this by providing transparent, AI-driven feedback that mirrors how recruiters and automated systems evaluate resumes.

---

## Who Is This For?

- Students entering the job market
- Early-career professionals
- Career changers updating their resumes
- Anyone who wants honest, structured resume feedback

---

## Key Features

- **Resume Upload & Preview** — Upload PDF resumes and view them directly in the application
- **AI-Based ATS Scoring** — Get a compatibility score that reflects how well your resume would perform in automated screening
- **Category-Wise Evaluation** — Receive scores and tips across five dimensions:
  - Tone & Style
  - Content Quality
  - Structure & Formatting
  - Skills Relevance
  - ATS Compatibility
- **Actionable Suggestions** — Each category includes specific tips marked as strengths or areas for improvement
- **Clean, Recruiter-Friendly UI** — Results are presented in a clear, professional layout

> **Extensibility Note:** The architecture supports future multi-AI ensemble scoring, where multiple AI perspectives (e.g., recruiter, hiring manager, language expert) can be combined for more robust feedback.

---

## How It Works

```
┌─────────────────┐
│  Resume Upload  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI Analysis   │
│  (Puter AI)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Feedback      │
│  Normalization  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   UI Rendering  │
│  (Resume Review)│
└─────────────────┘
```

1. **Upload** — User uploads a PDF resume
2. **Analysis** — The resume is sent to AI for evaluation against the target job description
3. **Normalization** — AI response is validated and normalized to a consistent feedback structure
4. **Rendering** — Scores and tips are displayed in the Resume Review page

The system prioritizes accuracy and determinism — what you see is what the AI evaluated, with no fabricated scores or placeholder data.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| AI Integration | Puter AI (GPT-4o-mini) |
| File Storage | Puter FS |
| Key-Value Storage | Puter KV |
| Build Tooling | Vite |
| Routing | React Router v7 |

---

## Screenshots

> Add screenshots of the application here.

| Upload Page | Resume Review |
|-------------|---------------|
| ![Upload Page](screenshots/upload.png) | ![Resume Review](screenshots/review.png) |

| ATS Score | Detailed Feedback |
|-----------|-------------------|
| ![ATS Score](screenshots/ats.png) | ![Details](screenshots/details.png) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hirenex-resume-analyzer.git
cd hirenex-resume-analyzer

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
├── app/
│   ├── components/       # UI components (Summary, ATS, Details, etc.)
│   ├── lib/              # Utilities and Puter integration
│   ├── routes/           # Page routes (upload, resume, home)
│   ├── feedback.ts       # Feedback type definitions
│   └── root.tsx          # Application root
├── constants/            # AI prompts and configuration
├── types/                # TypeScript type definitions
├── public/               # Static assets (icons, images)
└── README.md
```

### Key Files

| File | Purpose |
|------|---------|
| `app/lib/putter.ts` | Puter API integration and state management |
| `app/lib/multiAiFeedback.ts` | Multi-AI orchestration layer |
| `app/routes/upload.tsx` | Resume upload and analysis trigger |
| `app/routes/resume.tsx` | Resume review page |
| `app/components/Summary.tsx` | Overall score display |
| `app/components/ATS.tsx` | ATS compatibility section |
| `app/components/Details.tsx` | Category-wise feedback accordion |

---

## Design Principles

1. **No Fake Scores** — All feedback comes from real AI analysis. No hard-coded or placeholder values are displayed.

2. **AI-First, Deterministic UI** — The UI renders exactly what the AI returns, with proper validation and error handling.

3. **Separation of Concerns** — AI logic, state management, and UI rendering are cleanly separated.

4. **Trustworthy Feedback** — Users can rely on the scores and tips to make real improvements to their resumes.

5. **Graceful Degradation** — If AI analysis fails, the system handles errors gracefully without crashing.

---

## Limitations & Future Improvements

### Current Limitations

- Single AI perspective per analysis
- No resume version history or comparison
- No export functionality for feedback reports
- English-language resumes only

### Planned Improvements

- **Multi-AI Ensemble Scoring** — Combine feedback from multiple AI perspectives (ATS scanner, recruiter, hiring manager, language expert) with weighted aggregation
- **Role-Specific Feedback** — Tailor analysis based on industry and seniority level
- **Resume Version Comparison** — Track improvements across multiple resume versions
- **Exportable Reports** — Download feedback as PDF or share via link
- **Job Description Matching** — Deeper analysis of keyword alignment with specific job postings

---

## License & Disclaimer

This project is provided for **educational and demonstration purposes**.

- HIRENEX is not affiliated with any commercial ATS vendor
- AI feedback is advisory and should not be considered definitive hiring criteria
- Resume analysis results may vary based on AI model behavior

---

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

---

## Acknowledgments

- [Puter](https://puter.com) — Cloud platform powering AI, storage, and authentication
- [React](https://react.dev) — UI framework
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Zustand](https://zustand-demo.pmnd.rs) — State management
