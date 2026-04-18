import { NextResponse } from "next/server";
import { calculateChakras } from "../../../lib/chakra-utils";

export async function POST(req: Request) {
  const { answers } = await req.json();

  const result = calculateChakras(answers);

  return NextResponse.json({ success: true, data: result });
}