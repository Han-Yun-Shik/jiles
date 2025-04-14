import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/schdae`);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("학교 목록 요청 오류:", error);
    return NextResponse.json({ error: "학교 데이터 요청 실패" }, { status: 500 });
  }
}
