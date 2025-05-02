"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { REGDATE_STR, WR_STATE_ARR, WR_GENDER_ARR, WR_JCATE_ARR } from "@/app/utils";
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


export default function Jilesjform() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    wr_gubun: "gubunj",
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
  const [jbfiles6, setJbfiles6] = useState<File[]>([]);// [필수] 성적증명서 1부(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서) 
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
    // 모든 영역 숨기기
    document.getElementById("jcate1_area")?.classList.add("hidden");
    document.getElementById("jcate2_area")?.classList.add("hidden");

    // 선택된 영역만 보이게 설정
    if (formData.wr_cate === "jcate1") {
      document.getElementById("jcate1_area")?.classList.remove("hidden");
    } else if (formData.wr_cate === "jcate2") {
      document.getElementById("jcate2_area")?.classList.remove("hidden");
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

    // 장학구분별 필수 파일 체크
    //--### 도내 고교생 첨부파일(scate1) s ###--//
    if (formData.wr_cate === "jcate1" && jafiles1.length === 0) { alert("도내 고교생은 [필수] 개인정보 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles2.length === 0) { alert("도내 고교생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles3.length === 0) { alert("도내 고교생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles4.length === 0) { alert("도내 고교생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles5.length === 0) { alert("도내 고교생은 [필수] 학교장 추천서 1부(진흥원 서식) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles6.length === 0) { alert("도내 고교생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles7.length === 0) { alert("도내 고교생은 [필수] 대회 입상 실적표 1부(진흥원 서식) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate1" && jafiles8.length === 0) { alert("도내 고교생은 [필수] 입상실적 증빙서류을 첨부해야 합니다."); return; }
    //--### 도내 고교생 첨부파일(scate1) e ###--//

    //--### 국내 대학생 첨부파일(scate2) s ###--//
    if (formData.wr_cate === "jcate2" && jbfiles1.length === 0) { alert("국내 대학생은 [필수] 개인정보 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles2.length === 0) { alert("국내 대학생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles3.length === 0) { alert("국내 대학생은 [필수] 주민등록초본 1부(부모) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles4.length === 0) { alert("국내 대학생은 [필수] 가족관계증명서 1부 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles5.length === 0) { alert("국내 대학생은 [필수] 재학증명서 1부 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles6.length === 0) { alert("국내 대학생은 [필수] 성적증명서 1부 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles7.length === 0) { alert("국내 대학생은 [필수] 본인명의 통장사본 1부 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles8.length === 0) { alert("국내 대학생은 [필수] 대회 입상 실적표 1부(진흥원 서식) 파일을 첨부해야 합니다."); return; }
    if (formData.wr_cate === "jcate2" && jbfiles9.length === 0) { alert("국내 대학생은 [필수] 입상실적 증빙서류 파일을 첨부해야 합니다."); return; }
    //--### 국내 대학생 첨부파일(scate2) e ###--//

    const data = new FormData();
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
    jbfiles6.forEach((file) => data.append("jbfiles6", file));// [필수] 성적증명서 1부
    jbfiles7.forEach((file) => data.append("jbfiles7", file));// [필수] 본인명의 통장사본 1부
    jbfiles8.forEach((file) => data.append("jbfiles8", file));// [필수] 대회 입상 실적표 1부(진흥원 서식)
    jbfiles9.forEach((file) => data.append("jbfiles9", file));// [필수] 입상실적 증빙서류
    jbfiles10.forEach((file) => data.append("jbfiles10", file));// [선택] 대학 학적부 1부(2024학년도 군복무 휴학자)
    //--### 국내 대학생 첨부파일(jcate2) e ###--//

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
                  재능장학금 신청서 제출
                </h3>
              </div>
              <div>
                {/* 오른쪽에 버튼이나 링크 추가 가능 */}
              </div>
            </div>
          </div>


          <form onSubmit={handleSubmit}>
            <input type="hidden" name="wr_gubun" value="gubunj" />
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
                      {Object.entries(WR_JCATE_ARR).map(([key, label]) => (
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
                  <label className="text-sm font-medium text-gray-700">전공<br />(대학생 경우에만 입력)</label>
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
                    <input type="text" name="wr_ptel" className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm" onChange={handleChange} maxLength={11} placeholder="'-'생략 숫자만 입력" />
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
                  <label className="text-sm font-medium text-gray-700">[필수] 개인정보 수집 이용, 제3자 제공 동의서 1부</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader1.getRootProps}
                      getInputProps={jauploader1.getInputProps}
                      isDragActive={jauploader1.isDragActive}
                      files={jafiles1}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 주민등록초본 - 본인 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (본인)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader2.getRootProps}
                      getInputProps={jauploader2.getInputProps}
                      isDragActive={jauploader2.isDragActive}
                      files={jafiles2}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 주민등록초본 - 부모 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부 (부모)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader3.getRootProps}
                      getInputProps={jauploader3.getInputProps}
                      isDragActive={jauploader3.isDragActive}
                      files={jafiles3}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 가족관계증명서 1부 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 가족관계증명서 1부</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader4.getRootProps}
                      getInputProps={jauploader4.getInputProps}
                      isDragActive={jauploader4.isDragActive}
                      files={jafiles4}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 학교장 추천서 1부(진흥원 서식) */}
                  <label className="text-sm font-medium text-gray-700">[필수] 학교장 추천서 1부(진흥원 서식)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader5.getRootProps}
                      getInputProps={jauploader5.getInputProps}
                      isDragActive={jauploader5.isDragActive}
                      files={jafiles5}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 본인명의 통장사본 1부 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 본인명의 통장사본 1부 </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader6.getRootProps}
                      getInputProps={jauploader6.getInputProps}
                      isDragActive={jauploader6.isDragActive}
                      files={jafiles6}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 대회 입상 실적표 1부(진흥원 서식) */}
                  <label className="text-sm font-medium text-gray-700">[필수] 대회 입상 실적표 1부(진흥원 서식) </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader7.getRootProps}
                      getInputProps={jauploader7.getInputProps}
                      isDragActive={jauploader7.isDragActive}
                      files={jafiles7}
                      required={formData.wr_cate === "jcate1"}
                    />
                  </div>

                  {/* 입상실적 증빙서류 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 입상실적 증빙서류 </label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jauploader8.getRootProps}
                      getInputProps={jauploader8.getInputProps}
                      isDragActive={jauploader8.isDragActive}
                      files={jafiles8}
                      required={formData.wr_cate === "jcate1"}
                    />
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
                  <label className="text-sm font-medium text-gray-700">[필수] 개인정보 수집 이용, 제3자 제공 동의서 1부</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader1.getRootProps}
                      getInputProps={jbuploader1.getInputProps}
                      isDragActive={jbuploader1.isDragActive}
                      files={jbfiles1}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 주민등록초본 1부(본인) */}
                  <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부(본인)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader2.getRootProps}
                      getInputProps={jbuploader2.getInputProps}
                      isDragActive={jbuploader2.isDragActive}
                      files={jbfiles2}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 주민등록초본 1부(부모) */}
                  <label className="text-sm font-medium text-gray-700">[필수] 주민등록초본 1부(부모)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader3.getRootProps}
                      getInputProps={jbuploader3.getInputProps}
                      isDragActive={jbuploader3.isDragActive}
                      files={jbfiles3}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 가족관계증명서 1부 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 가족관계증명서 1부</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader4.getRootProps}
                      getInputProps={jbuploader4.getInputProps}
                      isDragActive={jbuploader4.isDragActive}
                      files={jbfiles4}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 재학증명서 1부 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 재학증명서 1부</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader5.getRootProps}
                      getInputProps={jbuploader5.getInputProps}
                      isDragActive={jbuploader5.isDragActive}
                      files={jbfiles5}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 성적증명서 1부 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 성적증명서 1부<br />(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader6.getRootProps}
                      getInputProps={jbuploader6.getInputProps}
                      isDragActive={jbuploader6.isDragActive}
                      files={jbfiles6}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 본인명의 통장사본 1부 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 본인명의 통장사본 1부</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader7.getRootProps}
                      getInputProps={jbuploader7.getInputProps}
                      isDragActive={jbuploader7.isDragActive}
                      files={jbfiles7}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 대회 입상 실적표 1부(진흥원 서식) */}
                  <label className="text-sm font-medium text-gray-700">[필수] 대회 입상 실적표 1부(진흥원 서식)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader8.getRootProps}
                      getInputProps={jbuploader8.getInputProps}
                      isDragActive={jbuploader8.isDragActive}
                      files={jbfiles8}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 입상실적 증빙서류 */}
                  <label className="text-sm font-medium text-gray-700">[필수] 입상실적 증빙서류</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader9.getRootProps}
                      getInputProps={jbuploader9.getInputProps}
                      isDragActive={jbuploader9.isDragActive}
                      files={jbfiles9}
                      required={formData.wr_cate === "jcate2"}
                    />
                  </div>

                  {/* 대학 학적부 1부(2024학년도 군복무 휴학자) */}
                  <label className="text-sm font-medium text-gray-700">[선택] 대학 학적부 1부<br />(2024학년도 군복무 휴학자)</label>
                  <div className="md:col-span-3">
                    <FileUploader
                      getRootProps={jbuploader10.getRootProps}
                      getInputProps={jbuploader10.getInputProps}
                      isDragActive={jbuploader10.isDragActive}
                      files={jbfiles10}
                    />
                  </div>

                </div>
              </div>
            </div>
            {/* 국내 대학생 파일첨부 e */}

            {/* 동의 사항 s */}
            <div className="flex justify-center p-4">
              <div className="w-full max-w-[1400px] bg-white p-8 rounded-lg shadow mt-6">
                <h4 className="text-2xl font-bold mb-6">학자금(재능 장학금) 중복지원방지 안내문</h4>

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