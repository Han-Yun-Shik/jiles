"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_JCATE_ARR } from "@/app/utils";
import { useDropzone } from "react-dropzone";
import Script from "next/script";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale"; // 한국어 설정 (선택)
import "@/styles/form.css";
import FileUploader from '@/components/FileUploader';
import { useFileUploader } from '@/hooks/useFileUploader';
import SchoolSearchModal from "@/components/SchoolSearchModal"; // 대학교
import SchoolSearchModalmid from "@/components/SchoolSearchModalmid"; // 고등학교
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

export default function Pjupdate() {
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
    const [showModal, setShowModal] = useState(false); // 대학교
    const [showModalmid, setShowModalmid] = useState(false); // 고등학교
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [years, setYears] = useState<number[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);

    const updateUrl = `/wuser/pjupdate/${id}`;

    // 임시저장 또는 제출을 구분할 변수
    const [saveMode, setSaveMode] = useState<"temp" | "submit">("submit");

    //--#################### 파일첨부 State s ####################--//
    //--### 도내 고교생 첨부파일(jcate1) s ###--//
    const [jafiles1, setJafiles1] = useState<File[]>([]);// [필수] 개인정보
    const [jafiles2, setJafiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [jafiles3, setJafiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [jafiles4, setJafiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [jafiles5, setJafiles5] = useState<File[]>([]);// [필수] 학교장 추천서 1부(진흥원 서식)
    const [jafiles6, setJafiles6] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [jafiles7, setJafiles7] = useState<File[]>([]);// [필수] 대회 입상 실적표 1부
    const [jafiles8, setJafiles8] = useState<File[]>([]);// [필수] 입상실적 증빙서류 

    const jauploader1 = useFileUploader(setJafiles1);
    const jauploader2 = useFileUploader(setJafiles2);
    const jauploader3 = useFileUploader(setJafiles3);
    const jauploader4 = useFileUploader(setJafiles4);
    const jauploader5 = useFileUploader(setJafiles5);
    const jauploader6 = useFileUploader(setJafiles6);
    const jauploader7 = useFileUploader(setJafiles7);
    const jauploader8 = useFileUploader(setJafiles8);
    //--### 도내 고교생 첨부파일(jcate1) e ###--//

    //--### 국내 대학생 첨부파일(jcate2) s ###--//
    const [jbfiles1, setJbfiles1] = useState<File[]>([]);// [필수] 개인정보
    const [jbfiles2, setJbfiles2] = useState<File[]>([]);// [필수] 주민등록초본 1부(본인)
    const [jbfiles3, setJbfiles3] = useState<File[]>([]);// [필수] 주민등록초본 1부(부모)
    const [jbfiles4, setJbfiles4] = useState<File[]>([]);// [필수] 가족관계증명서 1부
    const [jbfiles5, setJbfiles5] = useState<File[]>([]);// [필수] 재학증명서 1부
    const [jbfiles6, setJbfiles6] = useState<File[]>([]);// [필수] 학교장 추천서
    const [jbfiles7, setJbfiles7] = useState<File[]>([]);// [필수] 본인명의 통장사본 1부
    const [jbfiles8, setJbfiles8] = useState<File[]>([]);// [필수] 대회 입상 실적표 1부(진흥원 서식)
    const [jbfiles9, setJbfiles9] = useState<File[]>([]);// [필수] 입상실적 증빙서류
    const [jbfiles10, setJbfiles10] = useState<File[]>([]);// [선택] 대학 학적부 1부(2024학년도 군복무 휴학자)

    const jbuploader1 = useFileUploader(setJbfiles1);
    const jbuploader2 = useFileUploader(setJbfiles2);
    const jbuploader3 = useFileUploader(setJbfiles3);
    const jbuploader4 = useFileUploader(setJbfiles4);
    const jbuploader5 = useFileUploader(setJbfiles5);
    const jbuploader6 = useFileUploader(setJbfiles6);
    const jbuploader7 = useFileUploader(setJbfiles7);
    const jbuploader8 = useFileUploader(setJbfiles8);
    const jbuploader9 = useFileUploader(setJbfiles9);
    const jbuploader10 = useFileUploader(setJbfiles10);
    //--### 국내 대학생 첨부파일(jcate2) e ###--//
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
        document.getElementById("jcate1_area")?.classList.add("hidden");
        document.getElementById("jcate2_area")?.classList.add("hidden");

        document.getElementById("jcate1_scarea")?.classList.add("hidden");
        document.getElementById("jcate2_scarea")?.classList.add("hidden");

        // 선택된 영역만 보이게 설정
        if (formData.wr_cate === "jcate1") {
            document.getElementById("jcate1_area")?.classList.remove("hidden");
            document.getElementById("jcate1_scarea")?.classList.remove("hidden");
        } else if (formData.wr_cate === "jcate2") {
            document.getElementById("jcate2_area")?.classList.remove("hidden");
            document.getElementById("jcate2_scarea")?.classList.remove("hidden");
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

        if (isSubmitting) return; // 중복 제출 방지
        setIsSubmitting(true);    // 제출 시작

        if (saveMode !== "temp" && !formData.wr_year) { alert("년도를 선택해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_cate) { alert("장학구분을 선택해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_name.trim()) { alert("신청자 성명을 입력해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_birthy || !formData.wr_birthm || !formData.wr_birthd) { alert("생년월일을 모두 선택해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_post || !formData.wr_address) { alert("주소를 모두 입력해 주세요."); setIsSubmitting(false); return false; }
        if (saveMode !== "temp" && !formData.wr_phone || formData.wr_phone.length < 10) { alert("신청자 전화번호를 정확히 입력해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_email || !formData.wr_email.includes("@")) { alert("유효한 이메일 주소를 입력해 주세요."); setIsSubmitting(false); return; }

        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && (!formData.wr_school)) { alert("고등학교 정보를 모두 입력해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && (!formData.wr_schoolcode || !formData.wr_school)) { alert("대학교 정보를 모두 입력해 주세요."); setIsSubmitting(false); return; }

        if (saveMode !== "temp" && !formData.wr_grade) { alert("학년을 입력해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_bank_nm) { alert("은행명을 입력해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_bank_num) { alert("계좌번호를 입력해 주세요."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && !formData.wr_ptel || formData.wr_ptel.length < 10) { alert("보호자 전화번호를 정확히 입력해 주세요."); setIsSubmitting(false); return; }

        // 장학구분별 필수 파일 체크
        //--### 도내 고교생 첨부파일(scate1) s ###--//
        const hasJaFile1 = formData.files?.some(file => file.wr_title === "jafiles1");
        const hasJaFile2 = formData.files?.some(file => file.wr_title === "jafiles2");
        const hasJaFile3 = formData.files?.some(file => file.wr_title === "jafiles3");
        const hasJaFile4 = formData.files?.some(file => file.wr_title === "jafiles4");
        const hasJaFile5 = formData.files?.some(file => file.wr_title === "jafiles5");
        const hasJaFile6 = formData.files?.some(file => file.wr_title === "jafiles6");
        const hasJaFile7 = formData.files?.some(file => file.wr_title === "jafiles7");
        const hasJaFile8 = formData.files?.some(file => file.wr_title === "jafiles8");
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles1.length === 0 && !hasJaFile1) { alert("도내 고교생은 [필수] 개인정보 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles2.length === 0 && !hasJaFile2) { alert("도내 고교생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles3.length === 0 && !hasJaFile3) { alert("도내 고교생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles4.length === 0 && !hasJaFile4) { alert("도내 고교생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles5.length === 0 && !hasJaFile5) { alert("도내 고교생은 [필수] 학교장 추천서 1부(진흥원 서식) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles6.length === 0 && !hasJaFile6) { alert("도내 고교생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles7.length === 0 && !hasJaFile7) { alert("도내 고교생은 [필수] 대회 입상 실적표 1부(진흥원 서식) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate1" && jafiles8.length === 0 && !hasJaFile8) { alert("도내 고교생은 [필수] 입상실적 증빙서류을 첨부해야 합니다."); setIsSubmitting(false); return; }
        //--### 도내 고교생 첨부파일(scate1) e ###--//

        //--### 국내 대학생 첨부파일(scate2) s ###--//
        const hasJbFile1 = formData.files?.some(file => file.wr_title === "jbfiles1");
        const hasJbFile2 = formData.files?.some(file => file.wr_title === "jbfiles2");
        const hasJbFile3 = formData.files?.some(file => file.wr_title === "jbfiles3");
        const hasJbFile4 = formData.files?.some(file => file.wr_title === "jbfiles4");
        const hasJbFile5 = formData.files?.some(file => file.wr_title === "jbfiles5");
        const hasJbFile6 = formData.files?.some(file => file.wr_title === "jbfiles6");
        const hasJbFile7 = formData.files?.some(file => file.wr_title === "jbfiles7");
        const hasJbFile8 = formData.files?.some(file => file.wr_title === "jbfiles8");
        const hasJbFile9 = formData.files?.some(file => file.wr_title === "jbfiles9");
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles1.length === 0 && !hasJbFile1) { alert("국내 대학생은 [필수] 개인정보 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles2.length === 0 && !hasJbFile2) { alert("국내 대학생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles3.length === 0 && !hasJbFile3) { alert("국내 대학생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles4.length === 0 && !hasJbFile4) { alert("국내 대학생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles5.length === 0 && !hasJbFile5) { alert("국내 대학생은 [필수] 재학증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles6.length === 0 && !hasJbFile6) { alert("국내 대학생은 [필수] 학교장 추천서 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles7.length === 0 && !hasJbFile7) { alert("국내 대학생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles8.length === 0 && !hasJbFile8) { alert("국내 대학생은 [필수] 대회 입상 실적표 1부(진흥원 서식) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        if (saveMode !== "temp" && formData.wr_cate === "jcate2" && jbfiles9.length === 0 && !hasJbFile9) { alert("국내 대학생은 [필수] 입상실적 증빙서류 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
        //--### 국내 대학생 첨부파일(scate2) e ###--//

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

        //--### 도내 고교생 첨부파일(jcate1) s ###--//
        jafiles1.forEach((file) => data.append("jafiles1", file));// [필수] 개인정보
        jafiles2.forEach((file) => data.append("jafiles2", file));// [필수] 주민등록초본 1부(본인)
        jafiles3.forEach((file) => data.append("jafiles3", file));// [필수] 주민등록초본 1부(부모)
        jafiles4.forEach((file) => data.append("jafiles4", file));// [필수] 가족관계증명서 1부
        jafiles5.forEach((file) => data.append("jafiles5", file));// [필수] 학교장 추천서 1부(진흥원 서식)
        jafiles6.forEach((file) => data.append("jafiles6", file));// [필수] 본인명의 통장사본 1부
        jafiles7.forEach((file) => data.append("jafiles7", file));// [필수] 대회 입상 실적표 1부(진흥원 서식)
        jafiles8.forEach((file) => data.append("jafiles8", file));// [필수] 입상실적 증빙서류
        //--### 도내 고교생 첨부파일(jcate1) e ###--//

        //--### 국내 대학생 첨부파일(jcate2) s ###--//
        jbfiles1.forEach((file) => data.append("jbfiles1", file));// [필수] 개인정보
        jbfiles2.forEach((file) => data.append("jbfiles2", file));// [필수] 주민등록초본 1부(본인)
        jbfiles3.forEach((file) => data.append("jbfiles3", file));// [필수] 주민등록초본 1부(부모)
        jbfiles4.forEach((file) => data.append("jbfiles4", file));// [필수] 가족관계증명서 1부
        jbfiles5.forEach((file) => data.append("jbfiles5", file));// [필수] 재학증명서 1부
        jbfiles6.forEach((file) => data.append("jbfiles6", file));// [필수] 학교장 추천서
        jbfiles7.forEach((file) => data.append("jbfiles7", file));// [필수] 본인명의 통장사본 1부
        jbfiles8.forEach((file) => data.append("jbfiles8", file));// [필수] 대회 입상 실적표 1부(진흥원 서식)
        jbfiles9.forEach((file) => data.append("jbfiles9", file));// [필수] 입상실적 증빙서류
        jbfiles10.forEach((file) => data.append("jbfiles10", file));// [선택] 대학 학적부 1부(2024학년도 군복무 휴학자)
        //--### 국내 대학생 첨부파일(jcate2) e ###--//

        try {
            const response = await axios.put(`/api/wroute/sedit?id=${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            //setMessage(response.data.message);
            //버튼에 따라 wr_state 결정
            if (saveMode === "temp") {
                alert('임시저장되었습니다.');  // 임시저장
            } else if (saveMode === "submit") {
                alert('신청서 제출 되었습니다.');  // 신청서 제출
            }
            router.push("/wuser/plist");
            //window.location.href = updateUrl;
        } catch (error) {
            alert('데이터 전송 실패');
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

        const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/downloadall/${wr_code}`;

        // 동적으로 링크 생성하여 다운로드 유도
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${wr_code}_files.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleSelectSchool = (schoolName: string, schoolCode: string) => {
        setFormData(prev => ({
            ...prev,
            wr_school: schoolName,
            wr_schoolcode: schoolCode,
        }));
    };

    const handleSelectSchoolmid = (schoolName: string) => {
        setFormData(prev => ({
            ...prev,
            wr_school: schoolName,
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
        "jafiles1" |
        "jafiles2" |
        "jafiles3" |
        "jafiles4" |
        "jafiles5" |
        "jafiles6" |
        "jafiles7" |
        "jafiles8" |
        "jbfiles1" |
        "jbfiles2" |
        "jbfiles3" |
        "jbfiles4" |
        "jbfiles5" |
        "jbfiles6" |
        "jbfiles7" |
        "jbfiles8" |
        "jbfiles9" |
        "jbfiles10", index: number) => {
        const setStateMap = {
            jafiles1: setJafiles1,
            jafiles2: setJafiles2,
            jafiles3: setJafiles3,
            jafiles4: setJafiles4,
            jafiles5: setJafiles5,
            jafiles6: setJafiles6,
            jafiles7: setJafiles7,
            jafiles8: setJafiles8,
            jbfiles1: setJbfiles1,
            jbfiles2: setJbfiles2,
            jbfiles3: setJbfiles3,
            jbfiles4: setJbfiles4,
            jbfiles5: setJbfiles5,
            jbfiles6: setJbfiles6,
            jbfiles7: setJbfiles7,
            jbfiles8: setJbfiles8,
            jbfiles9: setJbfiles9,
            jbfiles10: setJbfiles10,
        };

        const setFiles = setStateMap[target];
        if (setFiles) {
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <>
            <UserMenu />

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

            <div className="jil_biz_hdr">제주인재육성 장학금 신청</div>

            <div className="d-flex bg-secondary-subtle p-3">
                <div className="w-100 bg-white p-4 mt-4">

                    <div className="flex justify-center p-4">
                        <div className="w-full max-w-[1400px] flex items-center justify-between bg-white p-6 rounded-2xl shadow">
                            <div className="flex items-center gap-3">
                                <GraduationCap className="w-8 h-8 text-blue-500" />
                                <h3 className="text-2xl font-bold text-gray-800">
                                    재능장학금 신청서 제출
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
                        <input type="hidden" name="wr_regdate" defaultValue={formData.wr_regdate} />
                        <div className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">장학구분</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <label className="text-sm font-medium text-gray-700">년도</label>
                                    <div className="md:col-span-3">
                                        <input type="text" name="wr_year" value={formData.wr_year || ''} className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm" onChange={handleChange} />
                                    </div>
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
                                            {Object.entries(WR_JCATE_ARR).map(([key, label]) => (
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
                                    <div className="md:col-span-3 space-y-2"><p className="text-red-700">※ 장학구분을 선택후 학교검색을 해주십시오.</p>
                                        {/* 재능장학금(도내고교생) */}
                                        <div id="jcate1_scarea" className="md:col-span-3 space-y-2">
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setShowModalmid(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
                                                    고등학교 검색
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

                                            {showModalmid && (
                                                <SchoolSearchModalmid
                                                    onSelect={handleSelectSchoolmid}
                                                    onClose={() => setShowModalmid(false)}
                                                />
                                            )}
                                        </div>

                                        {/* 재능장학금(국내대학생) */}
                                        <div id="jcate2_scarea" className="md:col-span-3 space-y-2">
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
                                                    대학교 검색
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
                                    <label className="text-sm font-medium text-gray-700">학과<br />(대학생 경우에만 입력)</label>
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

                        {/* 도내 고교생 파일첨부 s */}
                        <div id="jcate1_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">도내 고교생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("jafiles1")}
                                        >
                                            진흥원 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jauploader1.getRootProps}
                                            getInputProps={jauploader1.getInputProps}
                                            isDragActive={jauploader1.isDragActive}
                                            files={jafiles1}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles1", index)}
                                        />
                                        <div id="jafiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles1")
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
                                            getRootProps={jauploader2.getRootProps}
                                            getInputProps={jauploader2.getInputProps}
                                            isDragActive={jauploader2.isDragActive}
                                            files={jafiles2}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles2", index)}
                                        />
                                        <div id="jafiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles2")
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
                                            getRootProps={jauploader3.getRootProps}
                                            getInputProps={jauploader3.getInputProps}
                                            isDragActive={jauploader3.isDragActive}
                                            files={jafiles3}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles3", index)}
                                        />
                                        <div id="jafiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles3")
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
                                            getRootProps={jauploader4.getRootProps}
                                            getInputProps={jauploader4.getInputProps}
                                            isDragActive={jauploader4.isDragActive}
                                            files={jafiles4}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles4", index)}
                                        />
                                        <div id="jafiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles4")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 학교장 추천서 1부(진흥원 서식) */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 학교장 추천서 1부(진흥원 서식)<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("jafiles5")}
                                        >
                                            학교장 추천 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jauploader5.getRootProps}
                                            getInputProps={jauploader5.getInputProps}
                                            isDragActive={jauploader5.isDragActive}
                                            files={jafiles5}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles5", index)}
                                        />
                                        <div id="jafiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles5")
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
                                            getRootProps={jauploader6.getRootProps}
                                            getInputProps={jauploader6.getInputProps}
                                            isDragActive={jauploader6.isDragActive}
                                            files={jafiles6}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles6", index)}
                                        />
                                        <div id="jafiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles6")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 대회 입상 실적표 1부(진흥원 서식) */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 대회 입상 실적표 1부(진흥원 서식) <br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("jafiles7")}
                                        >
                                            대회 입상 실적표 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jauploader7.getRootProps}
                                            getInputProps={jauploader7.getInputProps}
                                            isDragActive={jauploader7.isDragActive}
                                            files={jafiles7}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles7", index)}
                                        />
                                        <div id="jafiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles7")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 입상실적 증빙서류 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 입상실적 증빙서류 </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jauploader8.getRootProps}
                                            getInputProps={jauploader8.getInputProps}
                                            isDragActive={jauploader8.isDragActive}
                                            files={jafiles8}
                                            onRemoveFile={(index) => handleRemoveFile("jafiles8", index)}
                                        />
                                        <div id="jafiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jafiles8")
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
                        {/* 도내 고교생 파일첨부 e */}

                        {/* 국내 대학생 파일첨부 s */}
                        <div id="jcate2_area" className="flex justify-center p-4">
                            <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow">
                                <h4 className="text-2xl font-bold mb-6">국내 대학생 파일첨부</h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

                                    {/* 개인정보 수집 이용 동의서 */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 개인정보 수집 이용, 제3자 제공 동의서 1부<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("jbfiles1")}
                                        >
                                            진흥원 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jbuploader1.getRootProps}
                                            getInputProps={jbuploader1.getInputProps}
                                            isDragActive={jbuploader1.isDragActive}
                                            files={jbfiles1}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles1", index)}
                                        />
                                        <div id="jbfiles1">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles1")
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
                                            getRootProps={jbuploader2.getRootProps}
                                            getInputProps={jbuploader2.getInputProps}
                                            isDragActive={jbuploader2.isDragActive}
                                            files={jbfiles2}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles2", index)}
                                        />
                                        <div id="jbfiles2">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles2")
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
                                            getRootProps={jbuploader3.getRootProps}
                                            getInputProps={jbuploader3.getInputProps}
                                            isDragActive={jbuploader3.isDragActive}
                                            files={jbfiles3}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles3", index)}
                                        />
                                        <div id="jbfiles3">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles3")
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
                                            getRootProps={jbuploader4.getRootProps}
                                            getInputProps={jbuploader4.getInputProps}
                                            isDragActive={jbuploader4.isDragActive}
                                            files={jbfiles4}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles4", index)}
                                        />
                                        <div id="jbfiles4">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles4")
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
                                            getRootProps={jbuploader5.getRootProps}
                                            getInputProps={jbuploader5.getInputProps}
                                            isDragActive={jbuploader5.isDragActive}
                                            files={jbfiles5}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles5", index)}
                                        />
                                        <div id="jbfiles5">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles5")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 성적증명서 1부 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 학교장 추천서</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jbuploader6.getRootProps}
                                            getInputProps={jbuploader6.getInputProps}
                                            isDragActive={jbuploader6.isDragActive}
                                            files={jbfiles6}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles6", index)}
                                        />
                                        <div id="jbfiles6">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles6")
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
                                            getRootProps={jbuploader7.getRootProps}
                                            getInputProps={jbuploader7.getInputProps}
                                            isDragActive={jbuploader7.isDragActive}
                                            files={jbfiles7}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles7", index)}
                                        />
                                        <div id="jbfiles7">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles7")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 대회 입상 실적표 1부(진흥원 서식) */}
                                    <label className="text-sm font-medium text-gray-700">
                                        [필수] 대회 입상 실적표 1부(진흥원 서식)<br />
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm jil_adm_mr_2"
                                            onClick={() => handleDownload("jbfiles8")}
                                        >
                                            대회 입상 실적표 서식 다운로드
                                        </button>
                                    </label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jbuploader8.getRootProps}
                                            getInputProps={jbuploader8.getInputProps}
                                            isDragActive={jbuploader8.isDragActive}
                                            files={jbfiles8}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles8", index)}
                                        />
                                        <div id="jbfiles8">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles8")
                                                .map((file, index) => (
                                                    <div key={index}>
                                                        <button type="button" onClick={() => fileDelete(file.file_seq)} className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* 입상실적 증빙서류 */}
                                    <label className="text-sm font-medium text-gray-700">[필수] 입상실적 증빙서류(상장사본, 대회 개최기관 사업자등록증 등)</label>
                                    <div className="md:col-span-3">
                                        <FileUploader
                                            getRootProps={jbuploader9.getRootProps}
                                            getInputProps={jbuploader9.getInputProps}
                                            isDragActive={jbuploader9.isDragActive}
                                            files={jbfiles9}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles9", index)}
                                        />
                                        <div id="jbfiles9">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles9")
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
                                            getRootProps={jbuploader10.getRootProps}
                                            getInputProps={jbuploader10.getInputProps}
                                            isDragActive={jbuploader10.isDragActive}
                                            files={jbfiles10}
                                            onRemoveFile={(index) => handleRemoveFile("jbfiles10", index)}
                                        />
                                        <div id="jbfiles10">
                                            {formData.files
                                                ?.filter(file => file.wr_title === "jbfiles10")
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
                        {/* 국내 대학생 파일첨부 e */}

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
                                disabled={!agreed || isSubmitting}
                                onClick={() => setSaveMode("temp")}
                                className="btn btn-secondary"
                            >
                                {agreed ? "임시저장" : "내용을 확인해 주세요"}
                            </button>

                            <button
                                type="submit"
                                disabled={!agreed || isSubmitting}
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