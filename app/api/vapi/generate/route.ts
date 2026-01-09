import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  const type = String(body.type ?? "");
  const role = String(body.role ?? "");
  const level = String(body.level ?? "");
  const amountRaw = body.amount;
  const userId = String(body.userId ?? body.userid ?? "");

  const amount =
    typeof amountRaw === "number"
      ? amountRaw
      : Number.parseInt(String(amountRaw ?? ""), 10);

  const techstackRaw = body.techstack;
  const techstackArray = Array.isArray(techstackRaw)
    ? techstackRaw.map((t) => String(t).trim()).filter(Boolean)
    : String(techstackRaw ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  if (!type || !role || !level || !userId || !Number.isFinite(amount)) {
    return Response.json(
      {
        success: false,
        error:
          "Missing required fields. Expected type, role, level, amount, and userId.",
      },
      { status: 400 }
    );
  }

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstackArray.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    let parsedQuestions: string[] = [];
    try {
      parsedQuestions = JSON.parse(questions) as string[];
    } catch {
      // If the model returns extra text, keep a safe fallback.
      parsedQuestions = [];
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstackArray,
      questions: parsedQuestions,
      userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const interviewRef = await db.collection("interviews").add(interview);
    console.log("Interview saved with ID:", interviewRef.id);

    return Response.json(
      { success: true, interviewId: interviewRef.id },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error saving interview:", error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
