import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';
import Strategy from '@/models/Strategy';
import { auth } from '@/auth';
import { getRandomMockQuestion, getRandomMockEvaluation } from '@/lib/mocks';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });

export async function POST(req: Request) {
  try {
    const { skill, answer, question, type, difficulty } = await req.json();

    if (process.env.MOCK_AI === "true" && type === 'generate') {
      const randomQ = getRandomMockQuestion(difficulty);
      return NextResponse.json({ question: randomQ });
    }

    if (type === 'generate') {
      const difficultyPrompt = difficulty === 'easy' 
        ? "Generate a foundational, introductory question to start the interview." 
        : "Generate a deep-dive, technical question.";

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `### ROLE
      You are the "Pathfinder Career Coach," a sophisticated AI interviewer specializing in transitioning software engineers into AI Engineering roles. Your tone is professional, encouraging, but rigorous.

      ### TASK
      ${difficultyPrompt}
      Subject skill: "${skill}". 
      Focus on "Agentic" workflows and modern AI stacks (Vertex AI, LangGraph, RAG).
      Maintain a minimalist, professional persona. Do not use emojis.

      Return ONLY the question text.`,
      });
      return NextResponse.json({ question: (result as any).text });
    }

    let evaluationData;

    if (process.env.MOCK_AI === "true" && type === 'evaluate') {
      evaluationData = getRandomMockEvaluation();
    } else if (type === 'evaluate') {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `### ROLE
You are the "Pathfinder Career Coach."

### TASK
Analyze the user's response to the following technical challenge:
Question: ${question}
User Answer: ${answer}
Skill: ${skill}

### ANALYSIS CRITERIA
1. Technical Accuracy (MERN, Python, LLM Orchestration).
2. Communication Clarity (Analyze for filler words or logical structure).
3. Alignment with AI Industry Standards.

### OUTPUT JSON STRUCTURE
{
  "score": number (0-10, composite of Depth and Confidence),
  "critique": string (FEEDBACK: A brief, high-level critique focusing on technical gaps and communication),
  "perfectAnswer": string (NEXT QUESTION: A logical follow-up based on their answer to continue the technical deep-dive)
}

Maintain a minimalist, professional persona. No emojis.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              critique: { type: Type.STRING },
              perfectAnswer: { type: Type.STRING }
            }
          }
        }
      });
      
      evaluationData = JSON.parse((result as any).text || '{}');
    }

    if (evaluationData) {
      // Save to MongoDB
      try {
        const session = await auth();
        const userId = session?.user?.id;
        
        await dbConnect();
        await Interview.create({
          userId: userId || undefined,
          skill,
          question,
          answer,
          score: evaluationData.score,
          critique: evaluationData.critique,
          perfectAnswer: evaluationData.perfectAnswer
        });

        // LEVEL-UP LOGIC: Update active strategy radar data
        if (userId) {
          const activeStrategy = await Strategy.findOne({ userId, isActive: true });
          if (activeStrategy) {
            let updated = false;
            activeStrategy.radarData = activeStrategy.radarData.map((item: any) => {
              if (item.skill.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(item.skill.toLowerCase())) {
                // Update current proficiency if new score is higher
                if (evaluationData.score > item.current) {
                  item.current = evaluationData.score;
                  updated = true;
                }
              }
              return item;
            });

            if (updated) {
              await activeStrategy.save();
            }
          }
        }
      } catch (dbError) {
        console.error('Failed to save interview or level up:', dbError);
      }

      return NextResponse.json(evaluationData);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Interview API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
