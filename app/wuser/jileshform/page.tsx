"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_HCATE_ARR, getCurrentKoreanYear } from "@/app/utils";
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


export default function Jileshform() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    wr_year: getCurrentKoreanYear(),
    wr_cate: "",
    wr_name: "",
    wr_birthy: "",
    wr_birthm: "",
    wr_birthd: "",
    wr_phone: "",
    wr_email: "",
    wr_post: "",
    wr_address: "",
    wr_detailaddress: "",
    wr_ptel: "",
    wr_schoolcode: "",
    wr_school: "",
    wr_schooladdr: "",
    wr_grade: "",
    wr_major: "",
    wr_jang_num: "",
    wr_bank_nm: "",
    wr_bank_num: "",
    wr_average: "",
    wr_gubun: "gubunh",
  });
  const [agreed, setAgreed] = useState(false)
  const [daumPostLoaded, setDaumPostLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false); // 대학교
  const [showModalmid, setShowModalmid] = useState(false); // 고등학교
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);

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
    // 모든 영역 숨기기
    document.getElementById("hcate1_area")?.classList.add("hidden");
    document.getElementById("hcate2_area")?.classList.add("hidden");
    document.getElementById("hcate3_area")?.classList.add("hidden");
    document.getElementById("hcate4_area")?.classList.add("hidden");

    document.getElementById("hcate1_scarea")?.classList.add("hidden");
    document.getElementById("hcate2_scarea")?.classList.add("hidden");

    // 선택된 영역만 보이게 설정
    if (formData.wr_cate === "hcate1") {

      document.getElementById("hcate1_area")?.classList.remove("hidden");
      document.getElementById("hcate1_scarea")?.classList.remove("hidden");

    } else if (formData.wr_cate === "hcate2") {

      document.getElementById("hcate2_area")?.classList.remove("hidden");
      document.getElementById("hcate2_scarea")?.classList.remove("hidden");

    } else if (formData.wr_cate === "hcate3") {

      document.getElementById("hcate3_area")?.classList.remove("hidden");
      document.getElementById("hcate2_scarea")?.classList.remove("hidden");

    } else if (formData.wr_cate === "hcate4") {

      document.getElementById("hcate4_area")?.classList.remove("hidden");
      document.getElementById("hcate1_scarea")?.classList.remove("hidden");

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

    if (!formData.wr_year) { alert("년도를 선택해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_cate) { alert("장학구분을 선택해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_name.trim()) { alert("신청자 성명을 입력해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_birthy || !formData.wr_birthm || !formData.wr_birthd) { alert("생년월일을 모두 선택해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_post || !formData.wr_address) { alert("주소를 모두 입력해 주세요."); setIsSubmitting(false); return false; }
    if (!formData.wr_phone || formData.wr_phone.length < 10) { alert("신청자 전화번호를 정확히 입력해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_email || !formData.wr_email.includes("@")) { alert("유효한 이메일 주소를 입력해 주세요."); setIsSubmitting(false); return; }
    
    if (formData.wr_cate === "hcate1" && !formData.wr_school) { alert("고등학교 정보를 모두 입력해 주세요."); setIsSubmitting(false); return; }
    if (formData.wr_cate === "hcate2" && !formData.wr_schoolcode || !formData.wr_school) { alert("대학교 정보를 모두 입력해 주세요."); setIsSubmitting(false); return; }
    if (formData.wr_cate === "hcate3" && !formData.wr_schoolcode || !formData.wr_school) { alert("대학교 정보를 모두 입력해 주세요."); setIsSubmitting(false); return; }
    if (formData.wr_cate === "hcate4" && !formData.wr_school) { alert("고등학교 정보를 모두 입력해 주세요."); setIsSubmitting(false); return; }
    
    
    if (!formData.wr_grade) { alert("학년을 입력해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_bank_nm) { alert("은행명을 입력해 주세요."); setIsSubmitting(false); return; }
    if (!formData.wr_bank_num) { alert("계좌번호를 입력해 주세요."); return; setIsSubmitting(false); }
    if (!formData.wr_ptel || formData.wr_ptel.length < 10) { alert("보호자 전화번호를 정확히 입력해 주세요."); setIsSubmitting(false); return; }

    // 장학구분별 필수 파일 체크
    //--### 고등학생 첨부파일(hcate1) s ###--//
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles1.length === 0) { alert("고등학생은 [필수] 개인정보 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles2.length === 0) { alert("고등학생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles3.length === 0) { alert("고등학생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles4.length === 0) { alert("고등학생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles5.length === 0) { alert("고등학생은 [필수] 재학증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles6.length === 0) { alert("고등학생은 [필수] 성적증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles7.length === 0) { alert("고등학생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate1" && hafiles8.length === 0) { alert("고등학생은 [필수] 소득수준 증빙자료을 첨부해야 합니다."); setIsSubmitting(false); return; }
    //--### 고등학생 첨부파일(hcate1) e ###--//

    //--### 대학 신입생 첨부파일(hcate2) s ###--//
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles1.length === 0) { alert("대학 신입생은 [필수] 개인정보 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles2.length === 0) { alert("대학 신입생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles3.length === 0) { alert("대학 신입생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles4.length === 0) { alert("대학 신입생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles5.length === 0) { alert("대학 신입생은 [필수] 재학증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles6.length === 0) { alert("대학 신입생은 [필수] 성적증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles7.length === 0) { alert("대학 신입생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate2" && hbfiles8.length === 0) { alert("대학 신입생은 [필수] 소득수준 증빙자료 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    //--### 대학 신입생 첨부파일(hcate2) e ###--//

    //--### 대학 재학생 첨부파일(hcate3) s ###--//
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles1.length === 0) { alert("대학 재학생은 [필수] 개인정보 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles2.length === 0) { alert("대학 재학생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles3.length === 0) { alert("대학 재학생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles4.length === 0) { alert("대학 재학생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles5.length === 0) { alert("대학 재학생은 [필수] 재학증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles6.length === 0) { alert("대학 재학생은 [필수] 성적증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles7.length === 0) { alert("대학 재학생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate3" && hcfiles8.length === 0) { alert("대학 재학생은 [필수] 소득수준 증빙자료 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    //--### 대학 재학생 첨부파일(hcate3) e ###--//

    //--### 비정규학교 첨부파일(hcate4) s ###--//
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles1.length === 0) { alert("비정규학교는 [필수] 개인정보 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles2.length === 0) { alert("비정규학교는 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles3.length === 0) { alert("비정규학교는 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles4.length === 0) { alert("비정규학교는 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles5.length === 0) { alert("비정규학교는 [필수] 재학증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles6.length === 0) { alert("비정규학교는 [필수] 성적증명서 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles7.length === 0) { alert("비정규학교는 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); setIsSubmitting(false); return; }
    if (saveMode !== "temp" && formData.wr_cate === "hcate4" && hdfiles8.length === 0) { alert("비정규학교는 [필수] 소득수준 증빙자료을 첨부해야 합니다."); setIsSubmitting(false); return; }
    //--### 비정규학교 첨부파일(hcate4) e ###--//

    const data = new FormData();
    data.append("wr_year", formData.wr_year);
    data.append("wr_cate", formData.wr_cate);
    data.append("wr_name", formData.wr_name);
    data.append("wr_birth", formData.wr_birthy + "-" + formData.wr_birthm + "-" + formData.wr_birthd);
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
    data.append("wr_gubun", formData.wr_gubun);

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
      const response = await axios.post("/api/wroute/jilessform", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      router.push("/");
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
    "hafiles1" |
    "hafiles2" |
    "hafiles3" |
    "hafiles4" |
    "hafiles5" |
    "hafiles6" |
    "hafiles7" |
    "hafiles8" |
    "hbfiles1" |
    "hbfiles2" |
    "hbfiles3" |
    "hbfiles4" |
    "hbfiles5" |
    "hbfiles6" |
    "hbfiles7" |
    "hbfiles8" |
    "hbfiles9" |
    "hcfiles1" |
    "hcfiles2" |
    "hcfiles3" |
    "hcfiles4" |
    "hcfiles5" |
    "hcfiles6" |
    "hcfiles7" |
    "hcfiles8" |
    "hcfiles9" |
    "hdfiles1" |
    "hdfiles2" |
    "hdfiles3" |
    "hdfiles4" |
    "hdfiles5" |
    "hdfiles6" |
    "hdfiles7" |
    "hdfiles8", index: number) => {
    const setStateMap = {
      hafiles1: setHafiles1,
      hafiles2: setHafiles2,
      hafiles3: setHafiles3,
      hafiles4: setHafiles4,
      hafiles5: setHafiles5,
      hafiles6: setHafiles6,
      hafiles7: setHafiles7,
      hafiles8: setHafiles8,
      hbfiles1: setHbfiles1,
      hbfiles2: setHbfiles2,
      hbfiles3: setHbfiles3,
      hbfiles4: setHbfiles4,
      hbfiles5: setHbfiles5,
      hbfiles6: setHbfiles6,
      hbfiles7: setHbfiles7,
      hbfiles8: setHbfiles8,
      hbfiles9: setHbfiles9,
      hcfiles1: setHcfiles1,
      hcfiles2: setHcfiles2,
      hcfiles3: setHcfiles3,
      hcfiles4: setHcfiles4,
      hcfiles5: setHcfiles5,
      hcfiles6: setHcfiles6,
      hcfiles7: setHcfiles7,
      hcfiles8: setHcfiles8,
      hcfiles9: setHcfiles9,
      hdfiles1: setHdfiles1,
      hdfiles2: setHdfiles2,
      hdfiles3: setHdfiles3,
      hdfiles4: setHdfiles4,
      hdfiles5: setHdfiles5,
      hdfiles6: setHdfiles6,
      hdfiles7: setHdfiles7,
      hdfiles8: setHdfiles8,
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
                  희망장학금 신청서 제출
                </h3>
              </div>
              <div>
                {/* 오른쪽에 버튼이나 링크 추가 가능 */}
              </div>
            </div>
          </div>


          <form onSubmit={handleSubmit}>
            <input type="hidden" name="wr_gubun" defaultValue="gubunh" />
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
                      {Object.entries(WR_HCATE_ARR).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
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
                    <div id="hcate1_scarea" className="md:col-span-3 space-y-2">
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
                    <div id="hcate2_scarea" className="md:col-span-3 space-y-2">
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
                    <input type="text" name="wr_ptel" className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm" onChange={handleChange} maxLength={11} placeholder="'-'생략 숫자만 입력" />
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
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm jil_adm_mr_2"
                      onClick={() => handleDownload("hafiles1")}
                    >
                      진흥원 서식 다운로드
                    </button>
                  </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={hauploader1.getRootProps}
                      getInputProps={hauploader1.getInputProps}
                      isDragActive={hauploader1.isDragActive}
                      files={hafiles1}
                      required={formData.wr_cate === "hcate1"}
                      onRemoveFile={(index) => handleRemoveFile("hafiles1", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles2", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles3", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles4", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles5", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles6", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles7", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hafiles8", index)}
                    />
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
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm jil_adm_mr_2"
                      onClick={() => handleDownload("hbfiles1")}
                    >
                      진흥원 서식 다운로드
                    </button>
                  </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={hbuploader1.getRootProps}
                      getInputProps={hbuploader1.getInputProps}
                      isDragActive={hbuploader1.isDragActive}
                      files={hbfiles1}
                      required={formData.wr_cate === "hcate2"}
                      onRemoveFile={(index) => handleRemoveFile("hbfiles1", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles2", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles3", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles4", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles5", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles6", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles7", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles8", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hbfiles9", index)}
                    />
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
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm jil_adm_mr_2"
                      onClick={() => handleDownload("hcfiles1")}
                    >
                      진흥원 서식 다운로드
                    </button>
                  </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={hcuploader1.getRootProps}
                      getInputProps={hcuploader1.getInputProps}
                      isDragActive={hcuploader1.isDragActive}
                      files={hcfiles1}
                      required={formData.wr_cate === "hcate3"}
                      onRemoveFile={(index) => handleRemoveFile("hcfiles1", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles2", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles3", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles4", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles5", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles6", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles7", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hcfiles8", index)}
                    />
                  </div>

                  {/* 대학 학적부 1부(2024학년도 군복무 휴학자) */}
                  <label className="text-sm font-medium text-gray-700">[선택] 대학 학적부 1부<br />(2024학년도 군복무 휴학자)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={hcuploader9.getRootProps}
                      getInputProps={hcuploader9.getInputProps}
                      isDragActive={hcuploader9.isDragActive}
                      files={hcfiles9}
                      onRemoveFile={(index) => handleRemoveFile("hcfiles9", index)}
                    />
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
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm jil_adm_mr_2"
                      onClick={() => handleDownload("hdfiles1")}
                    >
                      진흥원 서식 다운로드
                    </button>
                  </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={hduploader1.getRootProps}
                      getInputProps={hduploader1.getInputProps}
                      isDragActive={hduploader1.isDragActive}
                      files={hdfiles1}
                      required={formData.wr_cate === "hcate4"}
                      onRemoveFile={(index) => handleRemoveFile("hdfiles1", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles2", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles3", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles4", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles5", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles6", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles7", index)}
                    />
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
                      onRemoveFile={(index) => handleRemoveFile("hdfiles8", index)}
                    />
                  </div>

                </div>
              </div>
            </div>
            {/* 비정규학교 파일첨부 e */}

            {/* 동의 사항 s */}
            <div className="flex justify-center p-4">
              <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow mt-6">
                <h4 className="text-2xl font-bold mb-6">학자금(희망 장학금) 중복지원방지 안내문</h4>

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