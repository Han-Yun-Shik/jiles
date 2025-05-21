"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_HCATE_ARR } from "@/app/utils";
import "@/styles/form.css";



export default function Period() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        wr_code: "",
        wr_sy: "",
        wr_sm: "",
        wr_sd: "",
        wr_sh: "",
        wr_si: "",
        wr_ey: "",
        wr_em: "",
        wr_ed: "",
        wr_eh: "",
        wr_ei: "",
    });
    const [years, setYears] = useState<string[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);
    const [sigans, setSigans] = useState<string[]>([]);
    const [buns, setBuns] = useState<string[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/wroute/period`); // ✅ 쿼리 파라미터 방식으로 수정
                if (res.data && res.data.length > 0) {
                    const user = res.data[0];
                    setFormData(user);
                }
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: 2 }, (_, i) => String(currentYear + i));
        setYears(yearOptions);

        const monthOptions = Array.from({ length: 12 }, (_, i) =>
            String(i + 1).padStart(2, '0')
        );
        setMonths(monthOptions);

        const dayOptions = Array.from({ length: 31 }, (_, i) =>
            String(i + 1).padStart(2, '0')
        );
        setDays(dayOptions);

        const siganOptions = Array.from({ length: 24 }, (_, i) =>
            String(i + 0).padStart(2, '0')
        );
        setSigans(siganOptions);

        const bunOptions = Array.from({ length: 60 }, (_, i) =>
            String(i + 0).padStart(2, '0')
        );
        setBuns(bunOptions);
    }, []);

    console.log("formdata: ", formData)

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("wr_sy", formData.wr_sy);
        data.append("wr_sm", formData.wr_sm);
        data.append("wr_sd", formData.wr_sd);
        data.append("wr_sh", formData.wr_sh);
        data.append("wr_si", formData.wr_si);
        data.append("wr_ey", formData.wr_ey);
        data.append("wr_em", formData.wr_em);
        data.append("wr_ed", formData.wr_ed);
        data.append("wr_eh", formData.wr_eh);
        data.append("wr_ei", formData.wr_ei);

        try {
            const response = await axios.put(`/api/wroute/periodedit?id=${formData.wr_code}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
            alert("수정 성공!")
            // ✅ 저장 후 목록으로 리디렉션
            router.push('/wadm/period');
        } catch (error) {
            console.error("데이터 전송 실패:", error);
            setMessage("데이터 전송 실패");
            alert("수정 실패!")
        }
    };

    return (
        <>
            <div className="d-flex bg-secondary-subtle p-3">
                <div className="w-100 bg-white p-4 mt-4">
                    <div className="jil_adm_c_hdr">
                        <div className="jil_adm_c_hdr_left">신청접수 기간설정</div>
                        <div className="jil_adm_c_hdr_right">
                            &nbsp;
                        </div>
                    </div>

                    <div className="flex justify-center p-4">
                        <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

                                    <label className="text-sm font-medium text-gray-700">접수 시작</label>
                                    <div className="md:col-span-3">
                                        <select
                                            name="wr_sy"
                                            value={formData.wr_sy}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">년도</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}년</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_sm"
                                            value={formData.wr_sm}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">월</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>{month}월</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_sd"
                                            value={formData.wr_sd}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">일</option>
                                            {days.map((day) => (
                                                <option key={day} value={day}>{day}일</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_sh"
                                            value={formData.wr_sh}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">시</option>
                                            {sigans.map((sigan) => (
                                                <option key={sigan} value={sigan}>{sigan}시</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_si"
                                            value={formData.wr_si}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">분</option>
                                            {buns.map((bun) => (
                                                <option key={bun} value={bun}>{bun}분</option>
                                            ))}
                                        </select>
                                    </div>

                                    <label className="text-sm font-medium text-gray-700">접수 종료</label>
                                    <div className="md:col-span-3">
                                        <select
                                            name="wr_ey"
                                            value={formData.wr_ey}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">년도</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}년</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_em"
                                            value={formData.wr_em}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">월</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>{month}월</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_ed"
                                            value={formData.wr_ed}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">일</option>
                                            {days.map((day) => (
                                                <option key={day} value={day}>{day}일</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_eh"
                                            value={formData.wr_eh}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">시</option>
                                            {sigans.map((sigan) => (
                                                <option key={sigan} value={sigan}>{sigan}시</option>
                                            ))}
                                        </select>&nbsp;
                                        <select
                                            name="wr_ei"
                                            value={formData.wr_ei}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">분</option>
                                            {buns.map((bun) => (
                                                <option key={bun} value={bun}>{bun}분</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                                <div className="jil_adm_btn_wrap"><button className="btn btn-success">수정하기</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

