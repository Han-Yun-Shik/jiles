// app/api/proxy-downloadall/route.ts
import { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // http://localhost:3001 같은 값

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wr_code = searchParams.get("wr_code");

  if (!wr_code) {
    return new Response("wr_code 누락", { status: 400 });
  }

  const downloadUrl = `${API_BASE_URL}/api/downloadall/${wr_code}`;
  const res = await fetch(downloadUrl);

  if (!res.ok || !res.body) {
    return new Response("파일 다운로드 실패", { status: res.status });
  }

  const headers = new Headers();
  const contentType = res.headers.get("content-type") ?? "application/zip";
  const contentDisposition = res.headers.get("content-disposition") ?? "";

  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", contentDisposition);

  return new Response(res.body, {
    status: 200,
    headers,
  });
}
