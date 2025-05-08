"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_HCATE_ARR } from "@/app/utils";
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

export default function Phupdate() {
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

    const updateUrl = `/wuser/phupdate/${id}`;

    // 임시저장 또는 제출을 구분할 변수
    const [saveMode, setSaveMode] = useState<"temp" | "submit">("submit");

    //--#################### 파일첨부 State s ####################--//
    //--### 고교생 첨부파일(hcate1) s ###--//
    const [hafiles1, setHafiles1] = useState<File[]>([]);// [필수] 개인정보
    const [hafiles2, setHafiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [hafiles3, setHafiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [hafiles4, setHafiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [hafiles5, setHafiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [hafiles6, setHafiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(2024년도 성적증명서)
    const [hafiles7, setHafiles7] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [hafiles8, setHafiles8] = useState<File[]>([]);// [필수] 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류)

    const hauploader1 = useFileUploader(setHafiles1);
    const hauploader2 = useFileUploader(setHafiles2);
    const hauploader3 = useFileUploader(setHafiles3);
    const hauploader4 = useFileUploader(setHafiles4);
    const hauploader5 = useFileUploader(setHafiles5);
    const hauploader6 = useFileUploader(setHafiles6);
    const hauploader7 = useFileUploader(setHafiles7);
    const hauploader8 = useFileUploader(setHafiles8);
    //--### 고교생 첨부파일(hcate1) e ###--//

    //--### 대학 신입생 첨부파일(hcate2) s ###--//
    const [hbfiles1, setHbfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [hbfiles2, setHbfiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [hbfiles3, setHbfiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [hbfiles4, setHbfiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [hbfiles5, setHbfiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [hbfiles6, setHbfiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서) 
    const [hbfiles7, setHbfiles7] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [hbfiles8, setHbfiles8] = useState<File[]>([]);// [필수] 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류)
    const [hbfiles9, setHbfiles9] = useState<File[]>([]);// [선택] 대학 학적부 1부(2024학년도 군복무 휴학자)

    const hbuploader1 = useFileUploader(setHbfiles1);
    const hbuploader2 = useFileUploader(setHbfiles2);
    const hbuploader3 = useFileUploader(setHbfiles3);
    const hbuploader4 = useFileUploader(setHbfiles4);
    const hbuploader5 = useFileUploader(setHbfiles5);
    const hbuploader6 = useFileUploader(setHbfiles6);
    const hbuploader7 = useFileUploader(setHbfiles7);
    const hbuploader8 = useFileUploader(setHbfiles8);
    const hbuploader9 = useFileUploader(setHbfiles9);
    //--### 대학 신입생 첨부파일(hcate2) e ###--//

    //--### 대학 재학생 첨부파일(hcate3) s ###--//
    const [hcfiles1, setHcfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [hcfiles2, setHcfiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [hcfiles3, setHcfiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [hcfiles4, setHcfiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [hcfiles5, setHcfiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [hcfiles6, setHcfiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서) 
    const [hcfiles7, setHcfiles7] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [hcfiles8, setHcfiles8] = useState<File[]>([]);// [필수] 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류)
    const [hcfiles9, setHcfiles9] = useState<File[]>([]);// [선택] 대학 학적부 1부(2024학년도 군복무 휴학자)

    const hcuploader1 = useFileUploader(setHcfiles1);
    const hcuploader2 = useFileUploader(setHcfiles2);
    const hcuploader3 = useFileUploader(setHcfiles3);
    const hcuploader4 = useFileUploader(setHcfiles4);
    const hcuploader5 = useFileUploader(setHcfiles5);
    const hcuploader6 = useFileUploader(setHcfiles6);
    const hcuploader7 = useFileUploader(setHcfiles7);
    const hcuploader8 = useFileUploader(setHcfiles8);
    const hcuploader9 = useFileUploader(setHcfiles9);
    //--### 대학 재학생 첨부파일(hcate3) e ###--//

    //--### 비정규학교 등 평생교육시설 고교학력과정 재학생 첨부파일(hcate4) s ###--//
    const [hdfiles1, setHdfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [hdfiles2, setHdfiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [hdfiles3, setHdfiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [hdfiles4, setHdfiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [hdfiles5, setHdfiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [hdfiles6, setHdfiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(2024년도 성적증명서)
    const [hdfiles7, setHdfiles7] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [hdfiles8, setHdfiles8] = useState<File[]>([]);// [필수] 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류)

    const hduploader1 = useFileUploader(setHdfiles1);
    const hduploader2 = useFileUploader(setHdfiles2);
    const hduploader3 = useFileUploader(setHdfiles3);
    const hduploader4 = useFileUploader(setHdfiles4);
    const hduploader5 = useFileUploader(setHdfiles5);
    const hduploader6 = useFileUploader(setHdfiles6);
    const hduploader7 = useFileUploader(setHdfiles7);
    const hduploader8 = useFileUploader(setHdfiles8);
    //--### 비정규학교 등 평생교육시설 고교학력과정 재학생 첨부파일(hcate4) e ###--//
    //--#################### 파일첨부 State s ####################--//

    const [message, setMessage] = useState("");

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
        document.getElementById("hcate1_area")?.classList.add("hidden");
        document.getElementById("hcate2_area")?.classList.add("hidden");
        document.getElementById("hcate3_area")?.classList.add("hidden");
        document.getElementById("hcate4_area")?.classList.add("hidden");

        // 선택된 영역만 보이게 설정
        if (formData.wr_cate === "hcate1") {
            document.getElementById("hcate1_area")?.classList.remove("hidden");
        } else if (formData.wr_cate === "hcate2") {
            document.getElementById("hcate2_area")?.classList.remove("hidden");
        } else if (formData.wr_cate === "hcate3") {
            document.getElementById("hcate3_area")?.classList.remove("hidden");
        } else if (formData.wr_cate === "hcate4") {
            document.getElementById("hcate4_area")?.classList.remove("hidden");
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

        if (name === "wr_phone" || name === "wr_ptel") {
            newValue = value.replace(/\D/g, ""); // 숫자만 허용
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
        data.append("wr_regdate", formData.wr_regdate);

        // 🔥 버튼에 따라 wr_state 결정
        if (saveMode === "temp") {
            data.append("wr_state", "3");  // 임시저장
        } else if (saveMode === "submit") {
            data.append("wr_state", "1");  // 신청서 제출
        }

        //--### 고등학생 첨부파일(hcate1) s ###--//
        hafiles1.forEach((file) => data.append("hafiles1", file));// [필수] 개인정보
        hafiles2.forEach((file) => data.append("hafiles2", file));// [필수] 주민등록초본 1부(본인)
        hafiles3.forEach((file) => data.append("hafiles3", file));// [필수] 주민등록초본 1부(부모)
        hafiles4.forEach((file) => data.append("hafiles4", file));// [필수] 가족관계증명서 1부
        hafiles5.forEach((file) => data.append("hafiles5", file));// [필수] 재학증명서 1부
        hafiles6.forEach((file) => data.append("hafiles6", file));// [필수] 성적증명서 1부
        hafiles7.forEach((file) => data.append("hafiles7", file));// [필수] 본인명의 통장사본 1부
        hafiles8.forEach((file) => data.append("hafiles8", file));// [필수] 소득수준 증빙자료
        //--### 고등학생 첨부파일(hcate1) e ###--//

        //--### 대학 신입생 첨부파일(hcate2) s ###--//
        hbfiles1.forEach((file) => data.append("hbfiles1", file));// [필수] 개인정보
        hbfiles2.forEach((file) => data.append("hbfiles2", file));// [필수] 주민등록초본 1부(본인)
        hbfiles3.forEach((file) => data.append("hbfiles3", file));// [필수] 주민등록초본 1부(부모)
        hbfiles4.forEach((file) => data.append("hbfiles4", file));// [필수] 가족관계증명서 1부
        hbfiles5.forEach((file) => data.append("hbfiles5", file));// [필수] 재학증명서 1부
        hbfiles6.forEach((file) => data.append("hbfiles6", file));// [필수] 성적증명서 1부
        hbfiles7.forEach((file) => data.append("hbfiles7", file));// [필수] 본인명의 통장사본 1부
        hbfiles8.forEach((file) => data.append("hbfiles8", file));// [필수] 소득수준 증빙자료
        hbfiles9.forEach((file) => data.append("hbfiles9", file));// [선택] 대학 학적부 1부
        //--### 대학 신입생 첨부파일(hcate2) e ###--//

        //--### 대학 재입생 첨부파일(hcate3) s ###--//
        hcfiles1.forEach((file) => data.append("hcfiles1", file));// [필수] 개인정보
        hcfiles2.forEach((file) => data.append("hcfiles2", file));// [필수] 주민등록초본 1부(본인)
        hcfiles3.forEach((file) => data.append("hcfiles3", file));// [필수] 주민등록초본 1부(부모)
        hcfiles4.forEach((file) => data.append("hcfiles4", file));// [필수] 가족관계증명서 1부
        hcfiles5.forEach((file) => data.append("hcfiles5", file));// [필수] 재학증명서 1부
        hcfiles6.forEach((file) => data.append("hcfiles6", file));// [필수] 성적증명서 1부
        hcfiles7.forEach((file) => data.append("hcfiles7", file));// [필수] 본인명의 통장사본 1부
        hcfiles8.forEach((file) => data.append("hcfiles8", file));// [필수] 소득수준 증빙자료
        hcfiles9.forEach((file) => data.append("hcfiles9", file));// [선택] 대학 학적부 1부
        //--### 대학 재입생 첨부파일(hcate3) e ###--//

        //--### 비정규학교 첨부파일(hcate4) s ###--//
        hdfiles1.forEach((file) => data.append("hdfiles1", file));// [필수] 개인정보
        hdfiles2.forEach((file) => data.append("hdfiles2", file));// [필수] 주민등록초본 1부(본인)
        hdfiles3.forEach((file) => data.append("hdfiles3", file));// [필수] 주민등록초본 1부(부모)
        hdfiles4.forEach((file) => data.append("hdfiles4", file));// [필수] 가족관계증명서 1부
        hdfiles5.forEach((file) => data.append("hdfiles5", file));// [필수] 재학증명서 1부
        hdfiles6.forEach((file) => data.append("hdfiles6", file));// [필수] 성적증명서 1부
        hdfiles7.forEach((file) => data.append("hdfiles7", file));// [필수] 본인명의 통장사본 1부
        hdfiles8.forEach((file) => data.append("hdfiles8", file));// [필수] 소득수준 증빙자료
        //--### 비정규학교 첨부파일(hcate4) e ###--//

        try {
            const response = await axios.put(`/api/wroute/sedit?id=${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
            //router.push("/wuser/plist");
            window.location.href = updateUrl;
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

    const fileDelete = async (file_seq?: number) => {
        if (!file_seq) return;

        if (!window.confirm("정말 첨부파일을 삭제하시겠습니까?")) return;

        try {
            const res = await axios.delete(`/api/wroute/fdelete?id=${file_seq}`);
            if (res.status === 200) {
                //alert("첨부파일 삭제되었습니다.");
                //router.replace(updateUrl); // URL 유지 + 히스토리 반영
                //router.refresh();          // 서버 컴포넌트 데이터 재요청
                window.location.href = updateUrl;
            } else {
                alert("첨부파일 삭제 실패");
            }
        } catch (error) {
            console.error("첨부파일 삭제 오류:", error);
            alert("첨부파일 삭제 중 오류가 발생했습니다.");
        }
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
                                    희망장학금 신청서 제출
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
                        <input type="hidden" name="wr_year" defaultValue={formData.wr_year} />
                        <input type="hidden" name="wr_regdate" defaultValue={formData.wr_regdate} />
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
                                            {Object.entries(WR_HCATE_ARR).map(([key, label]) => (
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

                        {/* 고등학생 파일첨부 s */}
                        <div id="hcate1_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">고등학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/hafiles1`}
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            파일다운로드
                                        </a>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader1.getRootProps}
                                            getInputProps={hauploader1.getInputProps}
                                            isDragActive={hauploader1.isDragActive}
                                            files={hafiles1}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 - 본인 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (본인)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader2.getRootProps}
                                            getInputProps={hauploader2.getInputProps}
                                            isDragActive={hauploader2.isDragActive}
                                            files={hafiles2}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles2")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 - 부모 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (부모)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader3.getRootProps}
                                            getInputProps={hauploader3.getInputProps}
                                            isDragActive={hauploader3.isDragActive}
                                            files={hafiles3}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles3")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 가족관계증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 가족관계증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader4.getRootProps}
                                            getInputProps={hauploader4.getInputProps}
                                            isDragActive={hauploader4.isDragActive}
                                            files={hafiles4}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles4")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 재학증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 재학증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader5.getRootProps}
                                            getInputProps={hauploader5.getInputProps}
                                            isDragActive={hauploader5.isDragActive}
                                            files={hafiles5}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부(2024년도 성적증명서) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부(2024년도 성적증명서) </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader6.getRootProps}
                                            getInputProps={hauploader6.getInputProps}
                                            isDragActive={hauploader6.isDragActive}
                                            files={hafiles6}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 본인명의 통장사본 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 본인명의 통장사본 1부 </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader7.getRootProps}
                                            getInputProps={hauploader7.getInputProps}
                                            isDragActive={hauploader7.isDragActive}
                                            files={hafiles7}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles7")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류) </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hauploader8.getRootProps}
                                            getInputProps={hauploader8.getInputProps}
                                            isDragActive={hauploader8.isDragActive}
                                            files={hafiles8}
                                            required={formData.wr_cate === "hcate1"}
                                        />
                                        <div id="hafiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hafiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 고등학생 파일첨부 e */}

                        {/* 대학 신입생 파일첨부 s */}
                        <div id="hcate2_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학 신입생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/hbfiles1`}
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            파일다운로드
                                        </a>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader1.getRootProps}
                                            getInputProps={hbuploader1.getInputProps}
                                            isDragActive={hbuploader1.isDragActive}
                                            files={hbfiles1}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 1부(본인) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부(본인)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader2.getRootProps}
                                            getInputProps={hbuploader2.getInputProps}
                                            isDragActive={hbuploader2.isDragActive}
                                            files={hbfiles2}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles2")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 1부(부모) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부(부모)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader3.getRootProps}
                                            getInputProps={hbuploader3.getInputProps}
                                            isDragActive={hbuploader3.isDragActive}
                                            files={hbfiles3}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles3")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 가족관계증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 가족관계증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader4.getRootProps}
                                            getInputProps={hbuploader4.getInputProps}
                                            isDragActive={hbuploader4.isDragActive}
                                            files={hbfiles4}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles4")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 재학증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 재학증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader5.getRootProps}
                                            getInputProps={hbuploader5.getInputProps}
                                            isDragActive={hbuploader5.isDragActive}
                                            files={hbfiles5}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부<br />(2025학년도 대학수학능력시험 성적표, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader6.getRootProps}
                                            getInputProps={hbuploader6.getInputProps}
                                            isDragActive={hbuploader6.isDragActive}
                                            files={hbfiles6}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 본인명의 통장사본 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 본인명의 통장사본 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader7.getRootProps}
                                            getInputProps={hbuploader7.getInputProps}
                                            isDragActive={hbuploader7.isDragActive}
                                            files={hbfiles7}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles7")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 소득수준 증빙자료<br />(기초생활수급자 또는 차상위계층 등 관련 서류)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader8.getRootProps}
                                            getInputProps={hbuploader8.getInputProps}
                                            isDragActive={hbuploader8.isDragActive}
                                            files={hbfiles8}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 대학 학적부 1부(2024학년도 군복무 휴학자) */}
                                    <label className="text-sm font-medium text-gray-700">[선택] 대학 학적부 1부<br />(2024학년도 군복무 휴학자)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hbuploader9.getRootProps}
                                            getInputProps={hbuploader9.getInputProps}
                                            isDragActive={hbuploader9.isDragActive}
                                            files={hbfiles9}
                                            required={formData.wr_cate === "hcate2"}
                                        />
                                        <div id="hbfiles9">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hbfiles9")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 대학 신입생 파일첨부 e */}

                        {/* 대학 재입생 파일첨부 s */}
                        <div id="hcate3_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학 재입생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/hcfiles1`}
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            파일다운로드
                                        </a>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader1.getRootProps}
                                            getInputProps={hcuploader1.getInputProps}
                                            isDragActive={hcuploader1.isDragActive}
                                            files={hcfiles1}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 1부(본인) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부(본인)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader2.getRootProps}
                                            getInputProps={hcuploader2.getInputProps}
                                            isDragActive={hcuploader2.isDragActive}
                                            files={hcfiles2}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles2")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 1부(부모) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부(부모)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader3.getRootProps}
                                            getInputProps={hcuploader3.getInputProps}
                                            isDragActive={hcuploader3.isDragActive}
                                            files={hcfiles3}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles3")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 가족관계증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 가족관계증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader4.getRootProps}
                                            getInputProps={hcuploader4.getInputProps}
                                            isDragActive={hcuploader4.isDragActive}
                                            files={hcfiles4}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles4")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 재학증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 재학증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader5.getRootProps}
                                            getInputProps={hcuploader5.getInputProps}
                                            isDragActive={hcuploader5.isDragActive}
                                            files={hcfiles5}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부<br />(2025학년도 대학수학능력시험 성적표, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader6.getRootProps}
                                            getInputProps={hcuploader6.getInputProps}
                                            isDragActive={hcuploader6.isDragActive}
                                            files={hcfiles6}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 본인명의 통장사본 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 본인명의 통장사본 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader7.getRootProps}
                                            getInputProps={hcuploader7.getInputProps}
                                            isDragActive={hcuploader7.isDragActive}
                                            files={hcfiles7}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles7")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 소득수준 증빙자료<br />(기초생활수급자 또는 차상위계층 등 관련 서류)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader8.getRootProps}
                                            getInputProps={hcuploader8.getInputProps}
                                            isDragActive={hcuploader8.isDragActive}
                                            files={hcfiles8}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 대학 학적부 1부(2024학년도 군복무 휴학자) */}
                                    <label className="text-sm font-medium text-gray-700">[선택] 대학 학적부 1부<br />(2024학년도 군복무 휴학자)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hcuploader9.getRootProps}
                                            getInputProps={hcuploader9.getInputProps}
                                            isDragActive={hcuploader9.isDragActive}
                                            files={hcfiles9}
                                            required={formData.wr_cate === "hcate3"}
                                        />
                                        <div id="hcfiles9">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hcfiles9")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 대학 재입생 파일첨부 e */}

                        {/* 비정규학교 파일첨부 s */}
                        <div id="hcate4_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">비정규학교 등 평생교육시설 고교학력과정 재학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/download/hdfiles1`}
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            파일다운로드
                                        </a>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader1.getRootProps}
                                            getInputProps={hduploader1.getInputProps}
                                            isDragActive={hduploader1.isDragActive}
                                            files={hdfiles1}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 - 본인 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (본인)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader2.getRootProps}
                                            getInputProps={hduploader2.getInputProps}
                                            isDragActive={hduploader2.isDragActive}
                                            files={hdfiles2}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles2")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 주민등록초본 - 부모 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (부모)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader3.getRootProps}
                                            getInputProps={hduploader3.getInputProps}
                                            isDragActive={hduploader3.isDragActive}
                                            files={hdfiles3}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles3")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 가족관계증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 가족관계증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader4.getRootProps}
                                            getInputProps={hduploader4.getInputProps}
                                            isDragActive={hduploader4.isDragActive}
                                            files={hdfiles4}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles4")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 재학증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 재학증명서 1부</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader5.getRootProps}
                                            getInputProps={hduploader5.getInputProps}
                                            isDragActive={hduploader5.isDragActive}
                                            files={hdfiles5}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부(2024년도 성적증명서) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부(2024년도 성적증명서) </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader6.getRootProps}
                                            getInputProps={hduploader6.getInputProps}
                                            isDragActive={hduploader6.isDragActive}
                                            files={hdfiles6}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 본인명의 통장사본 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 본인명의 통장사본 1부 </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader7.getRootProps}
                                            getInputProps={hduploader7.getInputProps}
                                            isDragActive={hduploader7.isDragActive}
                                            files={hdfiles7}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles7")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 소득수준 증빙자료(기초생활수급자 또는 차상위계층 등 관련 서류) </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={hduploader8.getRootProps}
                                            getInputProps={hduploader8.getInputProps}
                                            isDragActive={hduploader8.isDragActive}
                                            files={hdfiles8}
                                            required={formData.wr_cate === "hcate4"}
                                        />
                                        <div id="hdfiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "hdfiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* 비정규학교 파일첨부 e */}

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
                                    한국장학재단에서는 「한국장학재단 설립 등에 관한 법률」제50조의5(중복지원의 방지),
                                    「취업 후 학자금 상환 특별법」제39조(중복 지원의 방지)에 따라 “중복지원 방지시스템”을 운영하고 있으며,
                                    각 기관에서 대학(원)생에게 학자금(장학금)을 지급한 내역이 있다면 “중복지원 방지시스템”에 등록을 요청하고 있습니다.<br /><br />

                                    <span className="font-bold">1. 학자금 중복지원 방지제도란?</span><br />
                                    학자금 지원의 균등한 배분과 학자금 관련 예산 집행의 효율성 제고를 위하여 동일 학기에 한 학생이 한국장학재단 및 기타학자금을 등록금 범위를 초과하여 지원 받지 않도록 하는 제도<br /><br />

                                    <span className="font-bold">2. 중복지원 범위</span><br />
                                    - 학자금 대출, 장학금 등 학자금 수혜금액이 등록금을 초과할 경우 중복지원자 등록<br />
                                    - 장학금 수혜금액의 합이 등록금을 초과한 경우 중복지원자로 등록<br />
                                    - 사설 및 기타, 정부, 대학 교내 장학금 및 학자금 대출 모두 포함<br />
                                    - 근로 장학금 및 생활비 지원 등 일부 장학금은 중복지원 범위에서 제외<br />
                                    - 교내 장학금은 근로, 공로, 도우미등 일부 장학금을 제외하고 모두 중복지원에 해당<br /><br />

                                    <span className="font-bold">3. 중복지원자 명단 및 금액확인</span><br />
                                    - 한국장학재단 전화문의(1599-2000)<br />
                                    - 한국장학재단 홈페이지(www.kosaf.go.kr) 로그인 → 사이버창구에서 확인<br /><br />

                                    <span className="font-bold">4. 학자금 대출이 있는 경우, 우선 상환 실시</span><br />
                                    원칙적으로 장학금은 학자금 대출 상환을 우선으로 실시해야 함. 이를 어길 경우 ｢한국장학재단｣ 중복지원자 명단에 등록됨<br /><br />

                                    <span className="font-bold">5. 중복지원자 명단에 등록되었을 경우 불이익 발생</span><br />
                                    한국장학재단에서 반환 및 상환 통지가 되며 기간 내에 따르지 않을 경우 법적인 변제의무 발생<br />
                                    중복지원 해소(수혜 학자금 상환 및 반환)시까지 국가장학금 수혜 및 학자금 대출 불가<br /><br />

                                    <span className="font-bold">6. 중복지원 해소(상환 및 반환) 절차</span><br />
                                    가. 학자금 대출자 : 장학금 수혜 후 대출금 미상환의 경우<br />
                                    * 한국장학재단(1599-2000) 전화문의 ⇒ 상환금액 및 가상계좌 확인 ⇒ 대출금 상환<br />
                                    나. 장학금 중복 수혜자 :<br />
                                    * 한국장학재단(1599-2000) 전화문의  ⇒ 반환금액(=등록금-장학금) 확인 ⇒ 수혜기관으로 반환
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