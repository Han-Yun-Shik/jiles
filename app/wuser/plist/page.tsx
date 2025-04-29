"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { REGDATE_YMD_STR, WR_STATE_ARR, WR_SCATE_ARR } from "@/app/utils";
import UserMenu from "@/components/UserMenu";
import UserIcon from '@/components/icons/UserIcon';

interface JilesData {
    wr_seq: number;
    wr_code: string;
    wr_year: string;
    wr_cate: string;
    wr_name: string;
    wr_phone: string;
    wr_school: string;
    wr_grade: string;
    wr_major: string;
    wr_state: number;
    wr_regdate: string;
}


export default function Plist() {
    const router = useRouter();
    const [data, setData] = useState<JilesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const storedData = localStorage.getItem("ploginData");

            if (!storedData) {
                router.push("/wuser/plogin"); // 인증 정보가 없으면 로그인 페이지로 이동
                return;
            }

            const ploginData = JSON.parse(storedData);
            console.log("ploginData: ", ploginData)
            try {
                const res = await axios.post(`/api/wroute/plist`, ploginData);

                if (res.data.length > 0) {
                    setData(res.data);
                } else {
                    setError("예약 정보를 불러올 수 없습니다.");
                }
            } catch (err) {
                console.error("예약 목록 조회 오류:", err);
                setError("예약 목록을 가져오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    return (
        <div>
            <UserMenu />

            <div className="jil_biz_hdr">접수확인</div>


            {/* 목록 s */}
            <div className="max-w-[1400px] mx-auto p-4">

                <h4 className="text-3xl font-extrabold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                    <span className="font-bold text-blue-600">{data?.[0]?.wr_name ?? '이름 없음'}</span>
                    <span>접수확인</span>
                </h4>

                <p className="text-center text-red-500 font-semibold mb-8">
                    임시저장 상태에서 수정이 가능합니다.
                </p>

                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="w-full text-sm text-center table-auto">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-2 w-[80px]">연도</th>
                                <th className="py-3 px-2">장학분야</th>
                                <th className="py-3 px-2">이름</th>
                                <th className="py-3 px-2">학교</th>
                                <th className="py-3 px-2">학년</th>
                                <th className="py-3 px-2">전공</th>
                                <th className="py-3 px-2">연락처</th>
                                <th className="py-3 px-2">진행상태</th>
                                <th className="py-3 px-2">등록일</th>
                                <th className="py-3 px-2 w-[200px]">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-b last:border-b-0">
                                    <td className="py-3 px-2">{item.wr_year}</td>
                                    <td className="py-3 px-2">{WR_SCATE_ARR[item.wr_cate]}</td>
                                    <td className="py-3 px-2">{item.wr_name}</td>
                                    <td className="py-3 px-2">{item.wr_school}</td>
                                    <td className="py-3 px-2">{item.wr_grade}</td>
                                    <td className="py-3 px-2">{item.wr_major}</td>
                                    <td className="py-3 px-2">{item.wr_phone}</td>
                                    <td className="py-3 px-2">
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs">
                                            {WR_STATE_ARR[item.wr_state]}
                                        </button>
                                    </td>
                                    <td className="py-3 px-2">{REGDATE_YMD_STR(item.wr_regdate)}</td>
                                    <td className="py-3 px-2 space-x-2">
                                        <Link
                                            href={`/wuser/pupdate/${item.wr_code}`}
                                            className="inline-block bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-3 rounded"
                                        >
                                            수정
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* 목록 e */}

        </div>
    );
}