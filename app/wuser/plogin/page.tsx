"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

interface PloginData {
  wr_email: string;
  wr_phone: string;
}


export default function Plogin() {
  const router = useRouter();
  const [formData, setFormData] = useState<PloginData>({ wr_email: "", wr_phone: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === "wr_phone" ? value.replace(/\D/g, "") : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(`/api/wroute/plogin`, formData);

      if (res.data.length > 0) {
        setMessage("✅ 인증 성공! 예약 목록으로 이동합니다.");
        localStorage.setItem("ploginData", JSON.stringify(formData));
        router.push("/wuser/plist");
      } else {
        setMessage("❌ 일치하는 예약 정보가 없습니다.");
      }
    } catch (error) {
      console.error("로그인 오류 발생:", error);
      setMessage("❌ 로그인 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <UserMenu />

      <div className="jil_biz_hdr">접수확인</div>
      
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            접수확인 로그인
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="wr_email" className="block mb-2 text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                type="email"
                id="wr_email"
                name="wr_email"
                value={formData.wr_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일 주소 입력"
              />
            </div>

            <div>
              <label htmlFor="wr_tel" className="block mb-2 text-sm font-medium text-gray-700">
                전화번호
              </label>
              <input
                type="text"
                id="wr_phone"
                name="wr_phone"
                value={formData.wr_phone}
                onChange={handleChange}
                required
                maxLength={11}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="'-' 제외 숫자만 입력"
              />
            </div>

            {message && (
              <p className="text-center text-sm text-red-500">{message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? "로딩 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link href="/" className="text-blue-600 hover:underline">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}