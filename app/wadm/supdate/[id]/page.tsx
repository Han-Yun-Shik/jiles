"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_SCATE_ARR } from "@/app/utils";
import { useDropzone } from "react-dropzone";
import "@/styles/form.css";
import FileUploader from '@/components/FileUploader';
import { useFileUploader } from '@/hooks/useFileUploader';
import SchoolSearchModal from "@/components/SchoolSearchModal";

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

export default function Slist() {
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

    const [daumPostLoaded, setDaumPostLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [years, setYears] = useState<number[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);

    //--##### Search arg s #####--//
    const searchParams = useSearchParams();
    const wyear = searchParams.get("wyear") || "";
    const wcate = searchParams.get("wcate") || "";
    const wname = searchParams.get("wname") || "";
    const wstate = searchParams.get("wstate") || "";
    const currentPage = searchParams.get("currentPage") || "1";
    const backToListUrl = `/wadm/slist?wyear=${wyear}&wcate=${wcate}&wname=${wname}&wstate=${wstate}&currentPage=${currentPage}`;
    const updateUrl = `/wadm/supdate/${id}?wyear=${wyear}&wcate=${wcate}&wname=${wname}&wstate=${wstate}&currentPage=${currentPage}`;

    //--##### Search arg e #####--//

    //--#################### 파일첨부 State s ####################--//
    //--### 대학 신입생 첨부파일(scate1) s ###--//
    const [aafiles1, setAafiles1] = useState<File[]>([]);// [필수] 개인정보
    const [aafiles2, setAafiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [aafiles3, setAafiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [aafiles4, setAafiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [aafiles5, setAafiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [aafiles6, setAafiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(2025학년도 대학수학능력시험 성적표) 
    const [aafiles7, setAafiles7] = useState<File[]>([]);// [필수] 등록금 납부 영수증 1부(2025학년도 1학기)
    const [aafiles8, setAafiles8] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부 

    const aauploader1 = useFileUploader(setAafiles1);
    const aauploader2 = useFileUploader(setAafiles2);
    const aauploader3 = useFileUploader(setAafiles3);
    const aauploader4 = useFileUploader(setAafiles4);
    const aauploader5 = useFileUploader(setAafiles5);
    const aauploader6 = useFileUploader(setAafiles6);
    const aauploader7 = useFileUploader(setAafiles7);
    const aauploader8 = useFileUploader(setAafiles8);
    //--### 대학 신입생 첨부파일(scate1) e ###--//

    //--### 대학 재학생 첨부파일(scate2) s ###--//
    const [abfiles1, setAbfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [abfiles2, setAbfiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [abfiles3, setAbfiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [abfiles4, setAbfiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [abfiles5, setAbfiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [abfiles6, setAbfiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서) 
    const [abfiles7, setAbfiles7] = useState<File[]>([]);// [필수] 등록금 납부 영수증 1부(2025학년도 1학기) 
    const [abfiles8, setAbfiles8] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [abfiles9, setAbfiles9] = useState<File[]>([]);// [선택] 대학 학적부 1부(2024학년도 군복무 휴학자)

    const abuploader1 = useFileUploader(setAbfiles1);
    const abuploader2 = useFileUploader(setAbfiles2);
    const abuploader3 = useFileUploader(setAbfiles3);
    const abuploader4 = useFileUploader(setAbfiles4);
    const abuploader5 = useFileUploader(setAbfiles5);
    const abuploader6 = useFileUploader(setAbfiles6);
    const abuploader7 = useFileUploader(setAbfiles7);
    const abuploader8 = useFileUploader(setAbfiles8);
    const abuploader9 = useFileUploader(setAbfiles9);
    //--### 대학 재학생 첨부파일(scate2) e ###--//

    //--### 대학원 석사재학생 첨부파일(scate3) s ###--//
    const [acfiles1, setAcfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [acfiles2, setAcfiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [acfiles3, setAcfiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [acfiles4, setAcfiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [acfiles5, setAcfiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [acfiles6, setAcfiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서) 
    const [acfiles7, setAcfiles7] = useState<File[]>([]);// [필수] 등록금 납부 영수증 1부(2025학년도 1학기) 
    const [acfiles8, setAcfiles8] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [acfiles9, setAcfiles9] = useState<File[]>([]);// [필수] 연구실적표 1부(진흥원 서식, SCI급 논문만 인정) *파일첨부 칸 옆에 연구실적표 서식 다운로드 필요
    const [acfiles10, setAcfiles10] = useState<File[]>([]);// [필수] 연구실적 증빙서류(갯수 제한 없음 셀추가 가능 기능 필요) 
    const [acfiles11, setAcfiles11] = useState<File[]>([]);// [선택] 대학 학적부 1부(2024학년도 군복무 휴학 이력자)

    const acuploader1 = useFileUploader(setAcfiles1);
    const acuploader2 = useFileUploader(setAcfiles2);
    const acuploader3 = useFileUploader(setAcfiles3);
    const acuploader4 = useFileUploader(setAcfiles4);
    const acuploader5 = useFileUploader(setAcfiles5);
    const acuploader6 = useFileUploader(setAcfiles6);
    const acuploader7 = useFileUploader(setAcfiles7);
    const acuploader8 = useFileUploader(setAcfiles8);
    const acuploader9 = useFileUploader(setAcfiles9);
    const acuploader10 = useFileUploader(setAcfiles10);
    const acuploader11 = useFileUploader(setAcfiles11);
    //--### 대학원 석사재학생 첨부파일(scate3) e ###--//
    //--#################### 파일첨부 State s ####################--//

    const [message, setMessage] = useState("");

    useEffect(() => {
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

        if (isSubmitting) return; // 중복 제출 방지
        setIsSubmitting(true);    // 제출 시작

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
        data.append("wr_state", String(formData.wr_state)); // 문자열로 변환
        data.append("wr_regdate", formData.wr_regdate);

        //--### 대학 신입생 첨부파일(scate1) s ###--//
        aafiles1.forEach((file) => data.append("aafiles1", file));// [필수] 개인정보
        aafiles2.forEach((file) => data.append("aafiles2", file));// [필수] 주민등록초본 1부(본인)
        aafiles3.forEach((file) => data.append("aafiles3", file));// [필수] 주민등록초본 1부(부모)
        aafiles4.forEach((file) => data.append("aafiles4", file));// [필수] 가족관계증명서 1부
        aafiles5.forEach((file) => data.append("aafiles5", file));// [필수] 재학증명서 1부
        aafiles6.forEach((file) => data.append("aafiles6", file));// [필수] 성적증명서 1부
        aafiles7.forEach((file) => data.append("aafiles7", file));// [필수] 등록금 납부 영수증 1부
        aafiles8.forEach((file) => data.append("aafiles8", file));// [필수] 본인명의 통장사본 1부
        //--### 대학 신입생 첨부파일(scate1) e ###--//

        //--### 대학 재학생 첨부파일(scate2) s ###--//
        abfiles1.forEach((file) => data.append("abfiles1", file));// [필수] 개인정보
        abfiles2.forEach((file) => data.append("abfiles2", file));// [필수] 주민등록초본 1부(본인)
        abfiles3.forEach((file) => data.append("abfiles3", file));// [필수] 주민등록초본 1부(부모)
        abfiles4.forEach((file) => data.append("abfiles4", file));// [필수] 가족관계증명서 1부
        abfiles5.forEach((file) => data.append("abfiles5", file));// [필수] 재학증명서 1부
        abfiles6.forEach((file) => data.append("abfiles6", file));// [필수] 성적증명서 1부
        abfiles7.forEach((file) => data.append("abfiles7", file));// [필수] 등록금 납부 영수증 1부
        abfiles8.forEach((file) => data.append("abfiles8", file));// [필수] 본인명의 통장사본 1부
        abfiles9.forEach((file) => data.append("abfiles9", file));// [선택] 대학 학적부
        //--### 대학 재학생 첨부파일(scate2) e ###--//

        //--### 대학원 석사재학생 첨부파일(scate3) s ###--//
        acfiles1.forEach((file) => data.append("acfiles1", file));// [필수] 개인정보
        acfiles2.forEach((file) => data.append("acfiles2", file));// [필수] 주민등록초본 1부(본인)
        acfiles3.forEach((file) => data.append("acfiles3", file));// [필수] 주민등록초본 1부(부모)
        acfiles4.forEach((file) => data.append("acfiles4", file));// [필수] 가족관계증명서 1부
        acfiles5.forEach((file) => data.append("acfiles5", file));// [필수] 재학증명서 1부
        acfiles6.forEach((file) => data.append("acfiles6", file));// [필수] 성적증명서 1부
        acfiles7.forEach((file) => data.append("acfiles7", file));// [필수] 등록금 납부 영수증 1부
        acfiles8.forEach((file) => data.append("acfiles8", file));// [필수] 본인명의 통장사본 1부
        acfiles9.forEach((file) => data.append("acfiles9", file));// [필수] 연구실적표 1부
        acfiles10.forEach((file) => data.append("acfiles10", file));// [필수] 연구실적 증빙서류
        acfiles11.forEach((file) => data.append("acfiles11", file));// [선택] 대학 학적부 1부
        //--### 대학원 석사재학생 첨부파일(scate3) e ###--//

        try {
            const response = await axios.put(`/api/wroute/sedit?id=${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
            //router.push(backToListUrl);
            //router.replace(updateUrl); // ✅ 수정페이지로 다시 이동 (파라미터 유지)
            //router.refresh();          // ✅ 데이터 갱신
            window.location.href = updateUrl;
        } catch (error) {
            console.error("데이터 전송 실패:", error);
            setMessage("데이터 전송 실패");
        } finally {
            setIsSubmitting(false); // 실패 시 다시 버튼 활성화
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

        try {
            const res = await fetch(`/api/wroute/proxy-downloadall?wr_code=${wr_code}`);

            if (!res.ok) {
                alert("다운로드 실패");
                return;
            }

            const blob = await res.blob();
            const contentDisposition = res.headers.get("Content-Disposition");
            const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
            const fileName = fileNameMatch?.[1] ?? `${wr_code}_files.zip`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = decodeURIComponent(fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("다운로드 오류", err);
            alert("다운로드 중 오류 발생");
        }
    };

    const handleSelectSchool = (schoolName: string, schoolCode: string) => {
        setFormData(prev => ({
            ...prev,
            wr_school: schoolName,
            wr_schoolcode: schoolCode,
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

    const handleDownload = async (code: string) => {
        try {
            const res = await fetch(`/api/wroute/proxy-download?dw_code=${code}`);

            if (!res.ok) {
                alert("파일 다운로드 실패");
                return;
            }

            const blob = await res.blob();
            const contentDisposition = res.headers.get("Content-Disposition");
            const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
            const fileName = fileNameMatch?.[1] ?? "downloaded_file.hwpx";

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = decodeURIComponent(fileName); // 파일명에 한글 포함 가능
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("다운로드 오류:", error);
            alert("다운로드 중 오류 발생");
        }
    };

    // 공통 삭제 핸들러
    const handleRemoveFile = (target:
        "aafiles1" |
        "aafiles2" |
        "aafiles3" |
        "aafiles4" |
        "aafiles5" |
        "aafiles6" |
        "aafiles7" |
        "aafiles8" |
        "abfiles1" |
        "abfiles2" |
        "abfiles3" |
        "abfiles4" |
        "abfiles5" |
        "abfiles6" |
        "abfiles7" |
        "abfiles8" |
        "abfiles9" |
        "acfiles1" |
        "acfiles2" |
        "acfiles3" |
        "acfiles4" |
        "acfiles5" |
        "acfiles6" |
        "acfiles7" |
        "acfiles8" |
        "acfiles9" |
        "acfiles10" |
        "acfiles11", index: number) => {
        const setStateMap = {
            aafiles1: setAafiles1,
            aafiles2: setAafiles2,
            aafiles3: setAafiles3,
            aafiles4: setAafiles4,
            aafiles5: setAafiles5,
            aafiles6: setAafiles6,
            aafiles7: setAafiles7,
            aafiles8: setAafiles8,
            abfiles1: setAbfiles1,
            abfiles2: setAbfiles2,
            abfiles3: setAbfiles3,
            abfiles4: setAbfiles4,
            abfiles5: setAbfiles5,
            abfiles6: setAbfiles6,
            abfiles7: setAbfiles7,
            abfiles8: setAbfiles8,
            abfiles9: setAbfiles9,
            acfiles1: setAcfiles1,
            acfiles2: setAcfiles2,
            acfiles3: setAcfiles3,
            acfiles4: setAcfiles4,
            acfiles5: setAcfiles5,
            acfiles6: setAcfiles6,
            acfiles7: setAcfiles7,
            acfiles8: setAcfiles8,
            acfiles9: setAcfiles9,
            acfiles10: setAcfiles10,
            acfiles11: setAcfiles11,
        };

        const setFiles = setStateMap[target];
        if (setFiles) {
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <>
            {isSubmitting && (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="text-lg mb-4">신청서 제줄 진행중 입니다...</div>
                    <div className="flex space-x-2 mt-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "-0.3s" }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "-0.15s" }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                    </div>
                </div>
            )}

            <div className="d-flex bg-secondary-subtle p-3">
                <div className="w-100 bg-white p-4 mt-4">
                    <div className="jil_adm_c_hdr">
                        <div className="jil_adm_c_hdr_left">성취장학금 신청서 제출 - 수정</div>
                        <div className="jil_adm_c_hdr_right">
                            <button onClick={handleSubmit} className="btn btn-secondary btn-sm jil_adm_mr_2">수정</button>&nbsp;
                            <button
                                type="button"
                                onClick={() => downloadAllFiles(`${id}`)}
                                className="btn btn-secondary btn-sm jil_adm_mr_2"
                            >
                                파일전체다운로드
                            </button>
                            &nbsp;
                            <button type="button" onClick={() => router.push(backToListUrl)} className="btn btn-secondary btn-sm">
                                목록
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">장학구분</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <label className="text-sm font-medium text-gray-700">년도</label>
                                    <div className="md:col-span-3">
                                        <input type="text" name="wr_year" value={formData.wr_year || ''} className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm" onChange={handleChange} />
                                    </div>
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
                                        <select
                                            name="wr_state"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                            value={formData.wr_state || 1}
                                            onChange={handleChange}
                                        >
                                            <option value="">진행상태 선택</option>
                                            {Object.entries(WR_STATE_ARR).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <label className="text-sm font-medium text-gray-700">등록일</label>
                                    <div className="md:col-span-3">
                                        <input type="text" name="wr_regdate" value={formData.wr_regdate || ''} className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm" onChange={handleChange} />
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
                                    <label className="text-sm font-medium text-gray-700">학과</label>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            name="wr_major"
                                            value={formData.wr_major}
                                            onChange={handleChange}
                                            placeholder="학과 입력"
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
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("aafiles1")}
                                        >
                                            진흥원 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={aauploader1.getRootProps}
                                            getInputProps={aauploader1.getInputProps}
                                            isDragActive={aauploader1.isDragActive}
                                            files={aafiles1}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles1", index)}
                                        />
                                        <div id="aafiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles1")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
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
                                            onRemoveFile={(index) => handleRemoveFile("aafiles2", index)}
                                        />
                                        <div id="aafiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles2")
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
                                            getRootProps={aauploader3.getRootProps}
                                            getInputProps={aauploader3.getInputProps}
                                            isDragActive={aauploader3.isDragActive}
                                            files={aafiles3}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles3", index)}
                                        />
                                        <div id="aafiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles3")
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
                                            getRootProps={aauploader4.getRootProps}
                                            getInputProps={aauploader4.getInputProps}
                                            isDragActive={aauploader4.isDragActive}
                                            files={aafiles4}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles4", index)}
                                        />
                                        <div id="aafiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles4")
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
                                            getRootProps={aauploader5.getRootProps}
                                            getInputProps={aauploader5.getInputProps}
                                            isDragActive={aauploader5.isDragActive}
                                            files={aafiles5}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles5", index)}
                                        />
                                        <div id="aafiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부<br />(해당 학학년도 대학수학능력시험 성적표) </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={aauploader6.getRootProps}
                                            getInputProps={aauploader6.getInputProps}
                                            isDragActive={aauploader6.isDragActive}
                                            files={aafiles6}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles6", index)}
                                        />
                                        <div id="aafiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 등록금 납부 영수증 1부(2025학년도 1학기) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 등록금 납부 영수증 1부(해당 학년도 1학기) </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={aauploader7.getRootProps}
                                            getInputProps={aauploader7.getInputProps}
                                            isDragActive={aauploader7.isDragActive}
                                            files={aafiles7}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles7", index)}
                                        />
                                        <div id="aafiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles7")
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
                                            getRootProps={aauploader8.getRootProps}
                                            getInputProps={aauploader8.getInputProps}
                                            isDragActive={aauploader8.isDragActive}
                                            files={aafiles8}
                                            onRemoveFile={(index) => handleRemoveFile("aafiles8", index)}
                                        />
                                        <div id="aafiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "aafiles8")
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

                        {/* 대학 재학생 파일첨부 s */}
                        <div id="scate2_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학 재학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("abfiles1")}
                                        >
                                            진흥원 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={abuploader1.getRootProps}
                                            getInputProps={abuploader1.getInputProps}
                                            isDragActive={abuploader1.isDragActive}
                                            files={abfiles1}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles1", index)}
                                        />
                                        <div id="abfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles1")
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
                                            getRootProps={abuploader2.getRootProps}
                                            getInputProps={abuploader2.getInputProps}
                                            isDragActive={abuploader2.isDragActive}
                                            files={abfiles2}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles2", index)}
                                        />
                                        <div id="abfiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles2")
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
                                            getRootProps={abuploader3.getRootProps}
                                            getInputProps={abuploader3.getInputProps}
                                            isDragActive={abuploader3.isDragActive}
                                            files={abfiles3}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles3", index)}
                                        />
                                        <div id="abfiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles3")
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
                                            getRootProps={abuploader4.getRootProps}
                                            getInputProps={abuploader4.getInputProps}
                                            isDragActive={abuploader4.isDragActive}
                                            files={abfiles4}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles4", index)}
                                        />
                                        <div id="abfiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles4")
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
                                            getRootProps={abuploader5.getRootProps}
                                            getInputProps={abuploader5.getInputProps}
                                            isDragActive={abuploader5.isDragActive}
                                            files={abfiles5}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles5", index)}
                                        />
                                        <div id="abfiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부<br />(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={abuploader6.getRootProps}
                                            getInputProps={abuploader6.getInputProps}
                                            isDragActive={abuploader6.isDragActive}
                                            files={abfiles6}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles6", index)}
                                        />
                                        <div id="abfiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 등록금 납부 영수증 1부(2025학년도 1학기) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 등록금 납부 영수증 1부<br />(해당 학년도 1학기)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={abuploader7.getRootProps}
                                            getInputProps={abuploader7.getInputProps}
                                            isDragActive={abuploader7.isDragActive}
                                            files={abfiles7}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles7", index)}
                                        />
                                        <div id="abfiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles7")
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
                                            getRootProps={abuploader8.getRootProps}
                                            getInputProps={abuploader8.getInputProps}
                                            isDragActive={abuploader8.isDragActive}
                                            files={abfiles8}
                                            onRemoveFile={(index) => handleRemoveFile("abfiles8", index)}
                                        />
                                        <div id="abfiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
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
                                            onRemoveFile={(index) => handleRemoveFile("abfiles9", index)}
                                        />
                                        <div id="abfiles9">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "abfiles9")
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
                        {/* 대학 재학생 파일첨부 e */}

                        {/* 대학원 석사재학생 파일첨부 s */}
                        <div id="scate3_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">대학원 석사재학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("acfiles1")}
                                        >
                                            진흥원 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader1.getRootProps}
                                            getInputProps={acuploader1.getInputProps}
                                            isDragActive={acuploader1.isDragActive}
                                            files={acfiles1}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles1", index)}
                                        />
                                        <div id="acfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles1")
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
                                            getRootProps={acuploader2.getRootProps}
                                            getInputProps={acuploader2.getInputProps}
                                            isDragActive={acuploader2.isDragActive}
                                            files={acfiles2}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles2", index)}
                                        />
                                        <div id="acfiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles2")
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
                                            getRootProps={acuploader3.getRootProps}
                                            getInputProps={acuploader3.getInputProps}
                                            isDragActive={acuploader3.isDragActive}
                                            files={acfiles3}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles3", index)}
                                        />
                                        <div id="acfiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles3")
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
                                            getRootProps={acuploader4.getRootProps}
                                            getInputProps={acuploader4.getInputProps}
                                            isDragActive={acuploader4.isDragActive}
                                            files={acfiles4}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles4", index)}
                                        />
                                        <div id="acfiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles4")
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
                                            getRootProps={acuploader5.getRootProps}
                                            getInputProps={acuploader5.getInputProps}
                                            isDragActive={acuploader5.isDragActive}
                                            files={acfiles5}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles5", index)}
                                        />
                                        <div id="acfiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부<br />(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader6.getRootProps}
                                            getInputProps={acuploader6.getInputProps}
                                            isDragActive={acuploader6.isDragActive}
                                            files={acfiles6}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles6", index)}
                                        />
                                        <div id="acfiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 등록금 납부 영수증 1부(2025학년도 1학기) */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 등록금 납부 영수증 1부<br />(해당 학년도 1학기)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader7.getRootProps}
                                            getInputProps={acuploader7.getInputProps}
                                            isDragActive={acuploader7.isDragActive}
                                            files={acfiles7}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles7", index)}
                                        />
                                        <div id="acfiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles7")
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
                                            getRootProps={acuploader8.getRootProps}
                                            getInputProps={acuploader8.getInputProps}
                                            isDragActive={acuploader8.isDragActive}
                                            files={acfiles8}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles8", index)}
                                        />
                                        <div id="acfiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 연구실적표 1부(진흥원 서식, SCI급 논문만 인정) */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 연구실적표 1부<br />(진흥원 서식, SCI급 논문만 인정)<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("acfiles9")}
                                        >
                                            연구실적표 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader9.getRootProps}
                                            getInputProps={acuploader9.getInputProps}
                                            isDragActive={acuploader9.isDragActive}
                                            files={acfiles9}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles9", index)}
                                        />
                                        <div id="acfiles9">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles9")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 연구실적 증빙서류 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 연구실적 증빙서류</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader10.getRootProps}
                                            getInputProps={acuploader10.getInputProps}
                                            isDragActive={acuploader10.isDragActive}
                                            files={acfiles10}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles10", index)}
                                        />
                                        <div id="acfiles10">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles10")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* [선택] 대학 학적부 1부(2024학년도 군복무 휴학 이력자) */}
                                    <label className="text-sm font-medium text-gray-700">[선택] 대학 학적부 1부<br />(해당 학년도 군복무 휴학 이력자)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={acuploader11.getRootProps}
                                            getInputProps={acuploader11.getInputProps}
                                            isDragActive={acuploader11.isDragActive}
                                            files={acfiles11}
                                            onRemoveFile={(index) => handleRemoveFile("acfiles11", index)}
                                        />
                                        <div id="acfiles11">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "acfiles11")
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
                        {/* 대학원 석사재학생 파일첨부 e */}

                        <div className="jil_adm_btn_wrap"><button className="btn btn-success">신청서 수정하기</button></div>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
        </>
    );
}

