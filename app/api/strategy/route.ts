import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import dbConnect from '@/lib/mongodb';
import Strategy from '@/models/Strategy';
import { auth } from '@/auth';
import { getRandomMockStrategy } from '@/lib/mocks';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (process.env.MOCK_AI === "true") {
      // Add artificial delay to simulate AI thinking time (UX improvement)
      await new Promise((resolve) => setTimeout(resolve, 4000));
      
      const mockData = getRandomMockStrategy();

      // Save to MongoDB even for mock
      try {
        const session = await auth();
        if (session?.user?.id) {
          await dbConnect();
          
          // Deactivate old, create new active
          await Strategy.updateMany({ userId: session.user.id }, { isActive: false });
          await Strategy.create({
            ...mockData,
            title: input || "Mock Career Strategy",
            userId: session.user.id,
            isActive: true,
            createdAt: new Date()
          });
        }
      } catch (dbError) {
        console.error('Failed to save mock strategy:', dbError);
      }

      return NextResponse.json({ ...mockData, title: input || "Mock Career Strategy" });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this user's professional background and tech stack: "${input}". 
      They want to transition into AI Engineering. 
      Provide a professional career intelligence strategy in English. 
      You MUST include a detailed technical architecture diagram in Mermaid.js format and comprehensive skill radar data.
      Return strictly JSON matching this structure:
      {
        "skillGap": [{ "skill": string, "current": string, "required": string, "gap": number (1-10) }],
        "radarData": [{ "skill": string, "current": number (1-10), "required": number (1-10) }], // MINIMUM 6 SKILLS for a good radar chart
        "mermaidDiagram": string (A valid Mermaid.js flowchart LR string showing the GCP architecture from ingestion to inference),
        "roadmap": [{ "milestone": string, "duration": string, "details": string[] }],
        "cloudStack": [{ "service": string, "role": string, "useCase": string }]
      }
      Focus on Google Cloud tools (Vertex AI, BigQuery, etc.) for the cloudStack.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skillGap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  current: { type: Type.STRING },
                  required: { type: Type.STRING },
                  gap: { type: Type.NUMBER }
                }
              }
            },
            radarData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  current: { type: Type.NUMBER },
                  required: { type: Type.NUMBER }
                }
              }
            },
            mermaidDiagram: { type: Type.STRING },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  milestone: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  details: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            cloudStack: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  service: { type: Type.STRING },
                  role: { type: Type.STRING },
                  useCase: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = (response as any).text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanText);

    // Save to MongoDB
    try {
      const session = await auth();
      if (session?.user?.id) {
        await dbConnect();
        
        // Deactivate all old strategies for this user
        await Strategy.updateMany({ userId: session.user.id }, { isActive: false });
        
        // Create new active strategy
        await Strategy.create({
          ...data,
          title: input,
          userId: session.user.id,
          isActive: true,
          createdAt: new Date()
        });
      }
    } catch (dbError) {
      console.error('Failed to save strategy:', dbError);
    }

    return NextResponse.json({ ...data, title: input });
  } catch (error: any) {
    console.error('Strategy API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Prioritize active strategy, fallback to latest
    const strategy = await Strategy.findOne({ userId: session.user.id, isActive: true })
      || await Strategy.findOne({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(strategy || null);
  } catch (error: any) {
    console.error('Fetch Strategy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
