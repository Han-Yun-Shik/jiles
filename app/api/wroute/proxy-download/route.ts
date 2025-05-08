// app/api/proxy-download/route.ts

import { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dw_code = searchParams.get("dw_code");

  if (!dw_code) {
    return new Response("코드 누락", { status: 400 });
  }

  // 외부 파일 서버 (http여도 가능하지만 https 권장)
  const downloadUrl = `${API_BASE_URL}/api/download/${dw_code}`;

  const response = await fetch(downloadUrl);

  if (!response.ok || !response.body) {
    return new Response("파일 다운로드 실패", { status: response.status });
  }

  // 필요한 헤더 복사
  const headers = new Headers();
  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  const contentDisposition = response.headers.get("content-disposition") ?? "";

  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", contentDisposition);

  return new Response(response.body, {
    status: 200,
    headers,
  });
}
