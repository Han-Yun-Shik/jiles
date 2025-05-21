"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { isWithinPeriod, PeriodData } from "@/lib/isWithinPeriod"; // 기간설정


export default function Jiless() {
  const [showButton, setShowButton] = useState(false); // 기간설정정

  // 기간설정정
  useEffect(() => {
    async function periodfetchData() {
      try {
        const res = await axios.get(`/api/wroute/period`); // ✅ 쿼리 파라미터 방식으로 수정
        if (res.data && res.data.length > 0) {
          const user = res.data[0];
          setShowButton(isWithinPeriod(user));
        }
      } catch (error) {
        console.error("기간설정 데이터 불러오기 오류:", error);
      }
    }

    periodfetchData();
  }, []);

  return (
    <>
      <UserMenu />

      <div className="jil_biz_hdr">제주인재육성 장학금 신청</div>

      <div className="max-w-[1400px] mx-auto p-4">

        <div className="space-y-12">
          {/* 섹션 - 사업목적 및 방향 */}
          <Section title="사업목적 및 방향" items={[
            "성적 우수 학생 및 경제적 취약계층 등 지역 출신 학생들에게 장학금 지원을 통해 학업 장려 및 제주지역의 우수 인재로 육성",
            "해외 인턴십 체계를 도입하여 제주 청년 대상 국제 경쟁력을 갖춘 학습 및 실무 경험을 제공함으로써 글로벌 혁신 역량 강화",
          ]} />

          {/* 섹션 - 사업개요 */}
          <Section title="사업개요" items={[
            "사업기간 : 2025년 1월 ~ 12월",
            "사업대상 : 제주도민(고등학생 및 대학(원)생)",
          ]} />

          {/* 섹션 - 주요사업 */}
          <Section title="주요사업" items={[
            "제주인재육성 장학금 지원사업 운영",
            "제주인재육성 특별지정장학금 지원사업 운영",
            "글로벌 혁신역량 강화사업 추진",
            "제주인재육성 장학금 기부 문화 활성화 추진 등",
          ]} />

          {/* 섹션 - 기대효과 */}
          <Section title="기대효과" items={[
            "장학금 지원과 해외 인턴십 기회 제공을 통해 학업 성취도와 글로벌 역량 강화 및 가계부담 완화",
            "교육 불평등 해소와 제주 지역의 지속 가능한 발전 및 국제 경쟁력 제고에 기여",
          ]} />

          {/* 섹션 - 그간의 성과 */}
          <Section title="그간의 성과" items={[
            "2024년 「제주인재육성 장학금」 장학생 선발 및 지원 : 296명, 417백만원",
            "2024년 「제주인재육성 특별지정장학금」 기부심사 및 기탁식 운영 : 5건, 221백만원",
            "2024년 제주청년해외연수 운영 (미국, 20명 대상)",
          ]} />

          {/* 버튼 영역 */}
          <div className="flex justify-center mt-10">
            {showButton && (
              <>
                <Link href="/wuser/jilessform" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition">
                  성취장학금
                </Link>
                &nbsp;
                <Link href="/wuser/jilesjform" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition">
                  재능장학금
                </Link>
                &nbsp;
                <Link href="/wuser/jileshform" className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition">
                  희망장학금
                </Link>
              </>
            )}

          </div>
        </div>

        {/* 하단 여백 */}
        <div className="h-20" />
      </div>
    </>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-2xl font-bold text-gray-700 mb-4">{title}</h4>
      <ul className="space-y-2 list-disc list-inside text-gray-600 text-base">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}