/**
 * Multi-AI Feedback Orchestration Layer
 * 
 * This module runs multiple AI analyses in parallel, each with a different
 * evaluation perspective, then combines them into a single consolidated
 * Feedback object using weighted aggregation.
 * 
 * AI Perspectives:
 * 1. ATS Scanner (35%) - Applicant Tracking System compatibility
 * 2. Recruiter (25%) - Human readability, clarity, narrative flow
 * 3. Hiring Manager (25%) - Role fit, seniority level, impact demonstration
 * 4. Language & Tone (15%) - Grammar, clarity, conciseness
 * 
 * The final output matches the existing Feedback interface exactly,
 * so the UI renders without any changes.
 */

import type { Feedback } from "../feedback";
import { AIResponseFormat } from "../../constants";

// Weights for each AI perspective (must sum to 1.0)
const AI_WEIGHTS = {
  ats: 0.35,
  recruiter: 0.25,
  hiringManager: 0.25,
  language: 0.15,
} as const;

// AI perspective prompts - each focuses on different evaluation criteria
const AI_PERSPECTIVES = {
  ats: (jobTitle: string, jobDescription: string) => `
You are an expert ATS (Applicant Tracking System) scanner.
Focus ONLY on ATS compatibility: keyword optimization, formatting for parsers, section headers, file structure.
Analyze this resume for how well it will pass through automated screening systems.
Job title: ${jobTitle}
Job description: ${jobDescription}
Provide feedback using this format: ${AIResponseFormat}
Return ONLY a JSON object, no other text, no backticks.`,

  recruiter: (jobTitle: string, jobDescription: string) => `
You are an experienced recruiter reviewing resumes.
Focus on: human readability, clarity of career narrative, first impressions, professional presentation.
Evaluate how compelling this resume is to a human reader scanning it quickly.
Job title: ${jobTitle}
Job description: ${jobDescription}
Provide feedback using this format: ${AIResponseFormat}
Return ONLY a JSON object, no other text, no backticks.`,

  hiringManager: (jobTitle: string, jobDescription: string) => `
You are a hiring manager evaluating candidates for your team.
Focus on: role fit, demonstrated impact, seniority alignment, relevant achievements, leadership indicators.
Assess whether this candidate would be a strong fit for the position.
Job title: ${jobTitle}
Job description: ${jobDescription}
Provide feedback using this format: ${AIResponseFormat}
Return ONLY a JSON object, no other text, no backticks.`,

  language: (jobTitle: string, jobDescription: string) => `
You are a professional editor and language expert.
Focus on: grammar, spelling, sentence clarity, conciseness, action verbs, professional tone.
Evaluate the writing quality and suggest improvements.
Job title: ${jobTitle}
Job description: ${jobDescription}
Provide feedback using this format: ${AIResponseFormat}
Return ONLY a JSON object, no other text, no backticks.`,
};

type AIRole = keyof typeof AI_PERSPECTIVES;

interface CategoryFeedback {
  score: number;
  tips: any[];
}

/**
 * Combines multiple tips arrays, removing duplicates and limiting count
 */
function combineTips(tipsArrays: any[][], maxTips: number = 4): any[] {
  const allTips: any[] = [];
  const seenTips = new Set<string>();

  for (const tips of tipsArrays) {
    if (!Array.isArray(tips)) continue;
    for (const tip of tips) {
      const tipKey = tip?.tip?.toLowerCase?.() || JSON.stringify(tip);
      if (!seenTips.has(tipKey)) {
        seenTips.add(tipKey);
        allTips.push(tip);
      }
    }
  }

  // Prioritize "improve" tips over "good" tips for actionable feedback
  const improveTips = allTips.filter(t => t?.type === "improve");
  const goodTips = allTips.filter(t => t?.type === "good");
  
  // Return balanced mix: more improve tips if available
  const result: any[] = [];
  const improveCount = Math.min(improveTips.length, Math.ceil(maxTips * 0.6));
  const goodCount = Math.min(goodTips.length, maxTips - improveCount);
  
  result.push(...improveTips.slice(0, improveCount));
  result.push(...goodTips.slice(0, goodCount));
  
  return result.slice(0, maxTips);
}

/**
 * Calculates weighted average score from multiple AI results
 */
function calculateWeightedScore(
  scores: { role: AIRole; score: number }[]
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const { role, score } of scores) {
    if (typeof score === "number" && !isNaN(score)) {
      const weight = AI_WEIGHTS[role];
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  // Normalize if some AIs failed (totalWeight < 1)
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Combines a specific category (e.g., ATS, toneAndStyle) from multiple feedbacks
 */
function combineCategory(
  feedbacks: { role: AIRole; feedback: Feedback }[],
  categoryKey: keyof Omit<Feedback, "overallScore">
): CategoryFeedback {
  const scores: { role: AIRole; score: number }[] = [];
  const tipsArrays: any[][] = [];

  for (const { role, feedback } of feedbacks) {
    const category = feedback[categoryKey];
    if (category && typeof category.score === "number") {
      scores.push({ role, score: category.score });
      if (Array.isArray(category.tips)) {
        tipsArrays.push(category.tips);
      }
    }
  }

  return {
    score: calculateWeightedScore(scores),
    tips: combineTips(tipsArrays),
  };
}

/**
 * Combines multiple Feedback objects into one consolidated result
 */
function combineFeedbacks(
  feedbacks: { role: AIRole; feedback: Feedback }[]
): Feedback {
  if (feedbacks.length === 0) {
    throw new Error("No valid AI feedbacks to combine");
  }

  // If only one feedback, return it directly
  if (feedbacks.length === 1) {
    return feedbacks[0].feedback;
  }

  // Calculate weighted overall score
  const overallScores = feedbacks.map(({ role, feedback }) => ({
    role,
    score: feedback.overallScore,
  }));

  return {
    overallScore: calculateWeightedScore(overallScores),
    ATS: combineCategory(feedbacks, "ATS"),
    toneAndStyle: combineCategory(feedbacks, "toneAndStyle"),
    content: combineCategory(feedbacks, "content"),
    structure: combineCategory(feedbacks, "structure"),
    skills: combineCategory(feedbacks, "skills"),
  };
}

/**
 * Validates that a feedback object has the required structure
 */
function isValidFeedback(feedback: any): feedback is Feedback {
  return (
    feedback &&
    typeof feedback.overallScore === "number" &&
    feedback.ATS &&
    feedback.toneAndStyle &&
    feedback.content &&
    feedback.structure &&
    feedback.skills
  );
}

/**
 * Runs a single AI analysis with a specific perspective
 */
async function runSingleAI(
  puter: typeof window.puter,
  path: string,
  role: AIRole,
  jobTitle: string,
  jobDescription: string
): Promise<{ role: AIRole; feedback: Feedback } | null> {
  const prompt = AI_PERSPECTIVES[role](jobTitle, jobDescription);

  try {
    console.log(`[Multi-AI] Starting ${role} analysis...`);
    
    const response: any = await puter.ai.chat(
      [
        {
          role: "user",
          content: [
            { type: "file", puter_path: path },
            { type: "text", text: prompt },
          ],
        },
      ],
      { model: "gpt-4o-mini" }
    );

    // Handle both response formats (same logic as putter.ts)
    let parsed: any;

    if (isValidFeedback(response)) {
      parsed = response;
    } else if (response?.message?.content) {
      const raw = response.message.content;
      if (typeof raw === "string") {
        parsed = JSON.parse(raw);
      } else if (typeof raw === "object") {
        parsed = raw;
      }
    }

    if (!isValidFeedback(parsed)) {
      console.warn(`[Multi-AI] ${role} returned invalid feedback structure`);
      return null;
    }

    console.log(`[Multi-AI] ${role} analysis complete. Score: ${parsed.overallScore}`);
    return { role, feedback: parsed };
  } catch (error) {
    console.error(`[Multi-AI] ${role} analysis failed:`, error);
    return null;
  }
}

/**
 * Main orchestration function - runs all AI perspectives and combines results
 * 
 * @param puter - The Puter API instance
 * @param path - Path to the uploaded resume file
 * @param jobTitle - Target job title
 * @param jobDescription - Target job description
 * @param onProgress - Optional callback for progress updates
 * @returns Combined Feedback object or undefined if all AIs fail
 */
export async function runMultiAIFeedback(
  puter: typeof window.puter,
  path: string,
  jobTitle: string,
  jobDescription: string,
  onProgress?: (status: string) => void
): Promise<Feedback | undefined> {
  const roles: AIRole[] = ["ats", "recruiter", "hiringManager", "language"];
  
  onProgress?.("Running multi-perspective AI analysis...");

  // Run all AI analyses in parallel for speed
  const results = await Promise.all(
    roles.map((role) => runSingleAI(puter, path, role, jobTitle, jobDescription))
  );

  // Filter out failed analyses
  const validResults = results.filter(
    (r): r is { role: AIRole; feedback: Feedback } => r !== null
  );

  console.log(`[Multi-AI] ${validResults.length}/${roles.length} analyses succeeded`);

  if (validResults.length === 0) {
    console.error("[Multi-AI] All AI analyses failed");
    return undefined;
  }

  // Log individual scores for debugging
  for (const { role, feedback } of validResults) {
    console.log(`[Multi-AI] ${role}: ${feedback.overallScore}/100`);
  }

  // Combine all valid feedbacks into one
  const combined = combineFeedbacks(validResults);
  
  console.log(`[Multi-AI] Combined overall score: ${combined.overallScore}/100`);
  onProgress?.("Analysis complete!");

  return combined;
}

/**
 * Fallback function - uses single AI if multi-AI is disabled or fails
 * This preserves the original behavior as a safety net
 */
export async function runSingleAIFallback(
  puter: typeof window.puter,
  path: string,
  jobTitle: string,
  jobDescription: string
): Promise<Feedback | undefined> {
  return runSingleAI(puter, path, "ats", jobTitle, jobDescription)
    .then((result) => result?.feedback);
}
