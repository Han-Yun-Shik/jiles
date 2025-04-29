"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_SCATE_ARR } from "@/app/utils";
import { useDropzone } from "react-dropzone";
import Script from "next/script";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale"; // 한국어 설정 (선택)
import "@/styles/form.css";
import FileUploader from '@/components/FileUploader';
import { useFileUploader } from '@/hooks/useFileUploader';
import SchoolSearchModal from "@/components/SchoolSearchModal";
import UserMenu from "@/components/UserMenu";
import CustomCheckbox from "@/components/ui/checkbox";
import { GraduationCap } from "lucide-react"; // 아이콘 라이브러리 사용 (lucide-react)

// 여기에 추가
declare global {
    interface Window {
        daum: any;
    }
}

interface FileData {
    file_seq: number;
    wr_code: string;
    file_name: string;
    file_rename: string;
    file_path: string;
    wr_title: string;
}

interface JilesData {
    wr_seq: number;
    wr_year: string;
    wr_cate: string;
    wr_name: string;
    wr_birth: string;
    wr_phone: string;
    wr_email: string;
    wr_post: string;
    wr_address: string;
    wr_detailaddress: string;
    wr_ptel: string;
    wr_schoolcode: string,
    wr_school: string,
    wr_schooladdr: string,
    wr_grade: string;
    wr_major: string;
    wr_jang_num: string;
    wr_bank_nm: string;
    wr_bank_num: string;
    wr_average: string;
    wr_state: number;
    wr_regdate: string;
    wr_update: string;
    files: FileData[]; // 파일 데이터 배열
}

export default function Pupdate() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<JilesData & {
        wr_birthy?: string;
        wr_birthm?: string;
        wr_birthd?: string;
    }>({
        wr_seq: 0,
        wr_year: '',
        wr_cate: '',
        wr_name: '',
        wr_birth: '',
        wr_birthy: '',
        wr_birthm: '',
        wr_birthd: '',
        wr_phone: '',
        wr_email: '',
        wr_post: '',
        wr_address: '',
        wr_detailaddress: '',
        wr_ptel: '',
        wr_schoolcode: '',
        wr_school: '',
        wr_schooladdr: '',
        wr_grade: '',
        wr_major: '',
        wr_jang_num: '',
        wr_bank_nm: '',
        wr_bank_num: '',
        wr_average: '',
        wr_state: 1,
        wr_regdate: '',
        wr_update: '',
        files: [],
    });
    const [agreed, setAgreed] = useState(false)
    const [daumPostLoaded, setDaumPostLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [years, setYears] = useState<number[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);

    // 임시저장 또는 제출을 구분할 변수
    const [saveMode, setSaveMode] = useState<"temp" | "submit">("submit");

    //--#################### 파일첨부 State s ####################--//
    //--### 대학 신입생 첨부파일(scate1) s ###--//
    const [aafiles1, setAafiles1] = useState<File[]>([]);// [필수] 개인정보
    const [aafiles2, setAafiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)

    const aauploader1 = useFileUploader(setAafiles1);
    const aauploader2 = useFileUploader(setAafiles2);
    //--### 대학 신입생 첨부파일(scate1) e ###--//

    //--### 대학 재학생 첨부파일(scate2) s ###--//
    const [abfiles1, setAbfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [abfiles9, setAbfiles9] = useState<File[]>([]);// [선택] 대학 학적부

    const abuploader1 = useFileUploader(setAbfiles1);
    const abuploader9 = useFileUploader(setAbfiles9);
    //--### 대학 재학생 첨부파일(scate2) e ###--//

    //--### 대학원 석사재학생 첨부파일(scate3) s ###--//
    const [acfiles1, setAcfiles1] = useState<File[]>([]);// [필수] 개인정보
    const acuploader1 = useFileUploader(setAcfiles1);
    //--### 대학원 석사재학생 첨부파일(scate3) e ###--//
    //--#################### 파일첨부 State s ####################--//

    const [message, setMessage] = useState("");

    //--#################### Dropzone for 파일첨부 s ####################--//

    //--#################### Dropzone for 파일첨부 e ####################--//

    useEffect(() => {
        const storedData = localStorage.getItem("ploginData");

        if (!storedData) {
            router.push("/wuser/plogin"); // 인증 정보가 없으면 로그인 페이지로 이동
            return;
        }

        async function fetchData() {
            try {
                const res = await axios.get(`/api/wroute/sread?id=${id}`);
                const data = res.data[0];
                if (Array.isArray(res.data)) {
                    if (data && typeof data === 'object') {
                        const [year, month, day] = data.wr_birth?.split('-') || ['', '', ''];
                        setFormData({
                            ...data,
                            wr_birthy: year,
                            wr_birthm: month,
                            wr_birthd: day,
                        });
                    }
                } else {
                    console.error("데이터 형식이 올바르지 않습니다:", res.data);
                }
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        // 모든 영역 숨기기
        document.getElementById("scate1_area")?.classList.add("hidden");
        document.getElementById("scate2_area")?.classList.add("hidden");
        document.getElementById("scate3_area")?.classList.add("hidden");

        document.getElementById("wr_average_scate1")?.classList.add("hidden");
        document.getElementById("wr_average_scate2")?.classList.add("hidden");
        document.getElementById("wr_average_scate3")?.classList.add("hidden");

        // 선택된 영역만 보이게 설정
        if (formData.wr_cate === "scate1") {
            document.getElementById("scate1_area")?.classList.remove("hidden");
            document.getElementById("wr_average_scate1")?.classList.remove("hidden");
        } else if (formData.wr_cate === "scate2") {
            document.getElementById("scate2_area")?.classList.remove("hidden");
            document.getElementById("wr_average_scate2")?.classList.remove("hidden");
        } else if (formData.wr_cate === "scate3") {
            document.getElementById("scate3_area")?.classList.remove("hidden");
            document.getElementById("wr_average_scate3")?.classList.remove("hidden");
        }
    }, [formData.wr_cate]);

    // ✅ 스크립트 동적 로딩
    useEffect(() => {
        const existingScript = document.getElementById('daum-postcode-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'daum-postcode-script';
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.async = true;
            script.onload = () => {
                setDaumPostLoaded(true);
            };
            document.body.appendChild(script);
        } else {
            setDaumPostLoaded(true); // 이미 로드된 경우
        }
    }, []);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearOptions = Array.from({ length: 51 }, (_, i) => currentYear - i);
        setYears(yearOptions);

        const monthOptions = Array.from({ length: 12 }, (_, i) =>
            String(i + 1).padStart(2, '0')
        );
        setMonths(monthOptions);

        const dayOptions = Array.from({ length: 31 }, (_, i) =>
            String(i + 1).padStart(2, '0')
        );
        setDays(dayOptions);
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        // 전화번호 입력 시 숫자만 허용
        if (name === "wr_ptel") {
            newValue = value.replace(/\D/g, ""); // 숫자가 아닌 문자 제거
        }

        if (name === "wr_phone") {
            newValue = value.replace(/\D/g, ""); // 숫자가 아닌 문자 제거
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append("wr_year", formData.wr_year);
        data.append("wr_cate", formData.wr_cate);
        data.append("wr_name", formData.wr_name);
        if (formData.wr_birthy && formData.wr_birthm && formData.wr_birthd) {
            data.append("wr_birth", `${formData.wr_birthy}-${formData.wr_birthm}-${formData.wr_birthd}`);
        } else {
            data.append("wr_birth", ""); // 또는 생략
        }
        data.append("wr_phone", formData.wr_phone);
        data.append("wr_email", formData.wr_email);
        data.append("wr_post", formData.wr_post);
        data.append("wr_address", formData.wr_address);
        data.append("wr_detailaddress", formData.wr_detailaddress);
        data.append("wr_ptel", formData.wr_ptel);
        data.append("wr_schoolcode", formData.wr_schoolcode);
        data.append("wr_school", formData.wr_school);
        data.append("wr_schooladdr", formData.wr_schooladdr);
        data.append("wr_grade", formData.wr_grade);
        data.append("wr_major", formData.wr_major);
        data.append("wr_jang_num", formData.wr_jang_num);
        data.append("wr_bank_nm", formData.wr_bank_nm);
        data.append("wr_bank_num", formData.wr_bank_num);
        data.append("wr_average", formData.wr_average);

        // 🔥 버튼에 따라 wr_state 결정
        if (saveMode === "temp") {
            data.append("wr_state", "3");  // 임시저장
        } else if (saveMode === "submit") {
            data.append("wr_state", "1");  // 신청서 제출
        }

        //--### 대학 신입생 첨부파일(scate1) s ###--//
        aafiles1.forEach((file) => data.append("aafiles1", file));// [필수] 개인정보
        aafiles2.forEach((file) => data.append("aafiles2", file));// [필수] 주민등록초본 1부(본인)
        //--### 대학 신입생 첨부파일(scate1) e ###--//

        //--### 대학 재학생 첨부파일(scate2) s ###--//
        abfiles1.forEach((file) => data.append("abfiles1", file));// [필수] 개인정보
        abfiles9.forEach((file) => data.append("abfiles9", file));// [선택] 대학 학적부
        //--### 대학 재학생 첨부파일(scate2) e ###--//

        //--### 대학원 석사재학생 첨부파일(scate3) s ###--//
        acfiles1.forEach((file) => data.append("acfiles1", file));// [필수] 개인정보
        //--### 대학원 석사재학생 첨부파일(scate3) e ###--//

        try {
            const response = await axios.put(`/api/wroute/sedit?id=${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
            router.push("/wuser/plist");
        } catch (error) {
            console.error("데이터 전송 실패:", error);
            setMessage("데이터 전송 실패");
        }
    };

    // 다음 주소 API 실행 함수
    const handleAddressSearch = () => {
        if (!daumPostLoaded || !window.daum?.Postcode) {
            alert('주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data: any) => {
                setFormData((prev) => ({
                    ...prev,
                    wr_post: data.zonecode,
                    wr_address: data.roadAddress,
                }));
            },
        }).open();
    };

    const downloadAllFiles = async (wr_code: string) => {
        if (!wr_code) return;

        const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/downloadall/${wr_code}`;

        // 동적으로 링크 생성하여 다운로드 유도
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${wr_code}_files.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleSelectSchool = (schoolName: string, schoolCode: string, schoolAddr: string) => {
        setFormData(prev => ({
            ...prev,
            wr_school: schoolName,
            wr_schoolcode: schoolCode,
            wr_schooladdr: schoolAddr,
        }));
    };


    return (
        <>
            <UserMenu />
            <div className="jil_biz_hdr">제주인재육성 장학금 신청</div>

            <div className="d-flex bg-secondary-subtle p-3">
                <div className="w-100 bg-white p-4 mt-4">

                    <div className="flex justify-center p-4">
                        <div className="w-full max-w-[1400px] flex items-center justify-between bg-white p-6 rounded-2xl shadow">
                            <div className="flex items-center gap-3">
                                <GraduationCap className="w-8 h-8 text-blue-500" />
                                <h3 className="text-2xl font-bold text-gray-800">
                                    성취장학금 신청서 제출
                                </h3>
                            </div>
                            <div>
                                {/* 오른쪽에 버튼이나 링크 추가 가능 */}
                                <Link
                                    href={`/wuser/plist`}
                                    className="inline-block bg-gray-600 hover:bg-gray-700 text-white text-xs py-2 px-3 rounded"
                                >
                                    목록
                                </Link>
                            </div>
                        </div>
                    </div>


                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="wr_year" value={formData.wr_year} />
                        <div className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">장학구분</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    {/* 장학분야 */}
                                    <label className="text-sm font-medium text-gray-700">장학분야</label>
                                    <div className="md:col-span-3">
                                        <select
                                            name="wr_cate"
                                            value={formData.wr_cate}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">장학구분 선택</option>
                                            {Object.entries(WR_SCATE_ARR).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <label className="text-sm font-medium text-gray-700">진행상태</label>
                                    <div className="md:col-span-3">
                                        {WR_STATE_ARR[formData.wr_state]}
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">학생정보</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

                                    {/* 신청자 성명 */}
                                    <label className="text-sm font-medium text-gray-700">신청자 성명</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_name"
                                            value={formData.wr_name}
                                            onChange={handleChange}
                                            placeholder="성명 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* 생년월일 */}
                                    <label className="text-sm font-medium text-gray-700">생년월일</label>
                                    <div className="flex gap-2 md:col-span-3">
                                        <select
                                            name="wr_birthy"
                                            value={formData.wr_birthy}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">년도</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}년</option>
                                            ))}
                                        </select>
                                        <select
                                            name="wr_birthm"
                                            value={formData.wr_birthm}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">월</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>{month}월</option>
                                            ))}
                                        </select>
                                        <select
                                            name="wr_birthd"
                                            value={formData.wr_birthd}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">일</option>
                                            {days.map((day) => (
                                                <option key={day} value={day}>{day}일</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 주소 */}
                                    <label className="text-sm font-medium text-gray-700">주소</label>
                                    <div className="md:col-span-3 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="wr_post"
                                                value={formData.wr_post}
                                                placeholder="우편번호"
                                                readOnly
                                                className="w-36 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                            />
                                            <button type="button" onClick={handleAddressSearch} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
                                                주소검색
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            name="wr_address"
                                            value={formData.wr_address}
                                            placeholder="도로명 주소"
                                            readOnly
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                        <input
                                            type="text"
                                            name="wr_detailaddress"
                                            value={formData.wr_detailaddress}
                                            placeholder="상세주소"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm mt-1"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* 전화번호 */}
                                    <label className="text-sm font-medium text-gray-700">전화번호</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_phone"
                                            value={formData.wr_phone}
                                            onChange={handleChange}
                                            maxLength={11}
                                            placeholder="'-' 없이 숫자만 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 이메일 */}
                                    <label className="text-sm font-medium text-gray-700">이메일</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="email"
                                            name="wr_email"
                                            value={formData.wr_email}
                                            onChange={handleChange}
                                            placeholder="이메일 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 학교 코드 및 명칭 */}
                                    <label className="text-sm font-medium text-gray-700">학교</label>
                                    <div className="md:col-span-3 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="wr_schoolcode"
                                                value={formData.wr_schoolcode}
                                                onChange={handleChange}
                                                placeholder="학교 코드"
                                                className="w-36 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                            />
                                            <button type="button" onClick={() => setShowModal(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
                                                학교검색
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            name="wr_school"
                                            value={formData.wr_school}
                                            onChange={handleChange}
                                            placeholder="학교명"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                        <input
                                            type="text"
                                            name="wr_schooladdr"
                                            value={formData.wr_schooladdr}
                                            onChange={handleChange}
                                            placeholder="학교 주소"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm mt-1"
                                        />

                                        {showModal && (
                                            <SchoolSearchModal
                                                onSelect={handleSelectSchool}
                                                onClose={() => setShowModal(false)}
                                            />
                                        )}
                                    </div>

                                    {/* 학년 */}
                                    <label className="text-sm font-medium text-gray-700">학년</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_grade"
                                            value={formData.wr_grade}
                                            onChange={handleChange}
                                            placeholder="학년 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 전공 */}
                                    <label className="text-sm font-medium text-gray-700">전공</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_major"
                                            value={formData.wr_major}
                                            onChange={handleChange}
                                            placeholder="전공 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 장학재단 고객번호 */}
                                    <label className="text-sm font-medium text-gray-700">장학재단 고객번호</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_jang_num"
                                            value={formData.wr_jang_num}
                                            onChange={handleChange}
                                            placeholder="장학재단 고객번호"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 본인명의 은행명 */}
                                    <label className="text-sm font-medium text-gray-700">은행명</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_bank_nm"
                                            value={formData.wr_bank_nm}
                                            onChange={handleChange}
                                            placeholder="은행명 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 본인명의 계좌번호 */}
                                    <label className="text-sm font-medium text-gray-700">계좌번호</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_bank_num"
                                            value={formData.wr_bank_num}
                                            onChange={handleChange}
                                            placeholder="계좌번호 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                    </div>

                                    {/* 평균성적 */}
                                    <label className="text-sm font-medium text-gray-700">평균성적</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_average"
                                            value={formData.wr_average}
                                            onChange={handleChange}
                                            placeholder="평균 성적 입력"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                                        />
                                        {/* 필요시 조건부 안내문구 추가 */}
                                        <div id="wr_average_scate1" className="jil_color_red">2과목 평균최고점수</div>
                                        <div id="wr_average_scate2" className="jil_color_red">학점 4.5 만점 기준 전과목 평균점수</div>
                                        <div id="wr_average_scate3" className="jil_color_red">학점 4.5 만점 기준 전과목 평균점수</div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">보호자정보</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

                                    <label className="text-sm font-medium text-gray-700">전화번호</label>
                                    <div className="md:col-span-3">
                                        <input type="text" name="wr_ptel" value={formData.wr_ptel} className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm" onChange={handleChange} maxLength={11} placeholder="'-'생략 숫자만 입력" />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* 대학 신입생 파일첨부 s */}
                        <div id="scate1_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학 신입생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 개인정보 수집 이용, 제3자 제공 동의서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={aauploader1.getRootProps}
                                            getInputProps={aauploader1.getInputProps}
                                            isDragActive={aauploader1.isDragActive}
                                            files={aafiles1}
                                        />
                                        <div id="aafiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (본인)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={aauploader2.getRootProps}
                                            getInputProps={aauploader2.getInputProps}
                                            isDragActive={aauploader2.isDragActive}
                                            files={aafiles2}
                                        />
                                        <div id="aafiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles2")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 대학 신입생 파일첨부 e */}

                        {/* 대학 재학생 파일첨부 s */}
                        <div id="scate2_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학 재학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 개인정보 수집 이용, 제3자 제공 동의서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={abuploader1.getRootProps}
                                            getInputProps={abuploader1.getInputProps}
                                            isDragActive={abuploader1.isDragActive}
                                            files={abfiles1}
                                        />
                                        <div id="abfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 대학 학적부 (선택사항) */}
                                    <label className="text-sm font-medium text-gray-700">[선택] 대학 학적부 1부 (2024학년도 군복무 휴학자)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={abuploader9.getRootProps}
                                            getInputProps={abuploader9.getInputProps}
                                            isDragActive={abuploader9.isDragActive}
                                            files={abfiles9}
                                        />
                                        <div id="abfiles9">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles9")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 대학 재학생 파일첨부 e */}

                        {/* 대학원 석사재학생 파일첨부 s */}
                        <div id="scate3_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학원 석사재학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 개인정보 수집 이용, 제3자 제공 동의서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader1.getRootProps}
                                            getInputProps={acuploader1.getInputProps}
                                            isDragActive={acuploader1.isDragActive}
                                            files={acfiles1}
                                        />
                                        <div id="acfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 대학원 석사재학생 파일첨부 e */}

                        {/* 동의 사항 s */}
                        <div className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow mt-6">
                                <h4 className="text-2xl font-bold mb-6">학자금(성취 장학금) 중복지원방지 안내문</h4>

                                <div className="flex items-center mb-6">
                                    <CustomCheckbox
                                        id="terms"
                                        checked={agreed}
                                        onCheckedChange={(checked) => setAgreed(!!checked)}
                                    />
                                    <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                                        안내문에 동의합니다.
                                    </label>
                                </div>

                                <div className="border p-4 bg-gray-50 rounded-md h-40 overflow-y-auto text-sm text-gray-700">
                                    내용 작성...
                                </div>
                            </div>
                        </div>
                        {/* 동의 사항 e */}

                        <div className="flex justify-center gap-3 mt-6">
                            <button
                                type="submit"
                                disabled={!agreed}
                                onClick={() => setSaveMode("temp")}
                                className="btn btn-secondary"
                            >
                                {agreed ? "임시저장" : "내용을 확인해 주세요"}
                            </button>

                            <button
                                type="submit"
                                disabled={!agreed}
                                onClick={() => setSaveMode("submit")}
                                className="btn btn-success"
                            >
                                {agreed ? "신청서 제출하기" : "내용을 확인해 주세요"}
                            </button>
                        </div>

                    </form>
                    <p>{message}</p>
                </div>
            </div>
        </>
    );
}