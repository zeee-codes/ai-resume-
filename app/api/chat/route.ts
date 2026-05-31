import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

const SYSTEM_INSTRUCTION = `You are an expert ATS Resume Recruiter AI. Your ONLY job is to interview users and extract resume data.

CRITICAL RULES:
1. Ask ONE question at a time. Never ask multiple questions.
2. Be conversational but DIRECT. No fluff.
3. Once you have collected: Name, Email, Phone, Target Role, 5 Skills, 2+ Projects with X-Y-Z metrics, STOP IMMEDIATELY.
4. When you have ALL required data, output ONLY a valid JSON object. NOTHING ELSE. No markdown. No explanations.
5. Do NOT ask follow-up questions. Do NOT ask "any other projects?". Do NOT say "thanks for sharing". Just output JSON.

Required JSON structure (output EXACTLY this format when data is complete):
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "targetRole": "string",
  "summary": "string",
  "skills": ["string", "string", "string", "string", "string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "techStack": ["string", "string"],
      "bullets": ["Accomplished X, measured by Y, by doing Z", "Accomplished X, measured by Y, by doing Z"]
    },
    {
      "name": "string",
      "description": "string",
      "techStack": ["string", "string"],
      "bullets": ["Accomplished X, measured by Y, by doing Z"]
    }
  ]
}

DATA COLLECTION CHECKLIST:
- [ ] Full Name
- [ ] Email
- [ ] Phone
- [ ] Target Role
- [ ] 5 Skills
- [ ] Project 1 (name, tech, 2+ X-Y-Z bullets)
- [ ] Project 2 (name, tech, 2+ X-Y-Z bullets)

Interview flow:
1. "Hi! I'm your ATS Resume Recruiter. What's your full name?"
2. "Great, [Name]! What's your email?"
3. "And your phone number?"
4. "What's your target job role?"
5. "What are your top 5 skills?"
6. "Tell me about your first project. What was it called?" (then tech stack, then metrics)
7. "Tell me about your second project..." (repeat)
8. Once all data is collected: Output JSON and ONLY JSON.

If user provides data in bulk (e.g., "My name is John, email is john@example.com, phone is 555-1234"), extract it and confirm, then ask for the next missing field.

NEVER say: "Anything else?", "Any other details?", "Any final thoughts?". STOP when data is complete and output JSON.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN is not configured in .env.local' },
        { status: 500 }
      );
    }

    // Format the conversation history for Llama 2 [INST] format
    let prompt = "";
    const systemSegment = `<<SYS>>\n${SYSTEM_INSTRUCTION}\n<</SYS>>\n\n`;
    let isFirstUser = true;

    for (const msg of messages) {
      if (msg.role === 'user') {
        if (isFirstUser) {
          prompt += `[INST] ${systemSegment}${msg.content} [/INST]`;
          isFirstUser = false;
        } else {
          prompt += ` [INST] ${msg.content} [/INST]`;
        }
      } else {
        prompt += ` ${msg.content}`;
      }
    }

    // Run the Llama 3 70b instruct model on Replicate
    const output = await replicate.run(
      "meta/meta-llama-3-70b-instruct",
      {
        input: {
          prompt: prompt,
          system_prompt: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          max_new_tokens: 2048
        }
      }
    );

    let text = "";
    if (Array.isArray(output)) {
      text = output.join("");
    } else if (typeof output === 'string') {
      text = output;
    } else {
      text = String(output || '');
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error: any) {
    console.error('Replicate API Error:', error);
    return NextResponse.json(
      { error: `Failed to generate response: ${error?.message || error || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

