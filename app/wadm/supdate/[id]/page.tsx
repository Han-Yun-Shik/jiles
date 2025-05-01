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

    const [years, setYears] = useState<number[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);

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

        // 선택된 영역만 보이게 설정
        if (formData.wr_cate === "scate1") {
            document.getElementById("scate1_area")?.classList.remove("hidden");
        } else if (formData.wr_cate === "scate2") {
            document.getElementById("scate2_area")?.classList.remove("hidden");
        } else if (formData.wr_cate === "scate3") {
            document.getElementById("scate3_area")?.classList.remove("hidden");
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
            router.push("/wadm/slist");
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
            <div className="d-flex bg-secondary-subtle p-3">
                <div className="w-100 bg-white p-4 mt-4">
                    <div className="jil_adm_c_hdr">
                        <div className="jil_adm_c_hdr_left">성취장학금 신청서 제출 - 수정</div>
                        <div className="jil_adm_c_hdr_right">
                            <button onClick={handleSubmit} className="btn btn-secondary btn-sm jil_adm_mr_2">수정</button>&nbsp;
                            <button onClick={() => downloadAllFiles(`${id}`)} className="btn btn-secondary btn-sm jil_adm_mr_2">파일전체다운로드</button>&nbsp;
                            <Link href="/wadm/slist" className="btn btn-secondary btn-sm">목록</Link>

                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="jil_adm_form_area">
                            <div className="jil_adm_form_title">■ 장학구분</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">년도</div>
                                <div><input type="text" name="wr_year" value={formData.wr_year || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">장학분야</div>
                                <div>
                                    <select
                                        name="wr_cate"
                                        value={formData.wr_cate || ''}
                                        className="jil_form_select jil_w_450"
                                        onChange={handleChange}
                                    >
                                        <option value="">장학구분 선택</option>
                                        {Object.entries(WR_SCATE_ARR).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="jil_form_field_subject">진행상태</div>
                                <div>
                                    <select
                                        name="wr_state"
                                        className="jil_form_select jil_w_450"
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

                                <div className="jil_form_field_subject">등록일</div>
                                <div><input type="text" name="wr_regdate" value={formData.wr_regdate || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>
                            </div>
                        </div>

                        <div className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 학생정보</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">신청자 성명</div>
                                <div><input type="text" name="wr_name" value={formData.wr_name || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">신청자 생년월일</div>
                                <div style={{ position: "relative" }}>

                                    <select
                                        name="wr_birthy"
                                        className="jil_form_select jil_w_120"
                                        value={formData.wr_birthy || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">년도 선택</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>
                                                {year}년
                                            </option>
                                        ))}
                                    </select>&nbsp;

                                    <select
                                        name="wr_birthm"
                                        className="jil_form_select jil_w_120"
                                        value={formData.wr_birthm || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">월 선택</option>
                                        {months.map(month => (
                                            <option key={month} value={month}>
                                                {month}월
                                            </option>
                                        ))}
                                    </select>&nbsp;

                                    <select
                                        name="wr_birthd"
                                        className="jil_form_select jil_w_120"
                                        value={formData.wr_birthd || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">일 선택</option>
                                        {days.map(day => (
                                            <option key={day} value={day}>
                                                {day}일
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div className="jil_form_field_subject">주소</div>
                                <div>
                                    <input type="text" name="wr_post" value={formData.wr_post || ''} className="jil_form_input jil_w_120" onChange={handleChange} placeholder="우편번호" readOnly />&nbsp;
                                    <input type="button" value="주소검색" onClick={handleAddressSearch} className="jil_state_btn" />
                                    <br />
                                    <input type="text" name="wr_address" value={formData.wr_address || ''} className="jil_form_input jil_w_per_100  mt-2" onChange={handleChange} placeholder="도로명 주소" readOnly />
                                    <input type="text" name="wr_detailaddress" value={formData.wr_detailaddress || ''} className="jil_form_input jil_w_per_100  mt-2" onChange={handleChange} placeholder="상세주소" />
                                </div>

                                <div className="jil_form_field_subject">전화번호</div>
                                <div><input type="text" name="wr_phone" value={formData.wr_phone || ''} className="jil_form_input jil_w_450" onChange={handleChange} maxLength={11} placeholder="'-'생략 숫자만 입력" /></div>

                                <div className="jil_form_field_subject">이메일</div>
                                <div><input type="text" name="wr_email" value={formData.wr_email || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">학교</div>
                                <div>
                                    <input type="text" name="wr_schoolcode" value={formData.wr_schoolcode || ''} className="jil_form_input jil_w_120" onChange={handleChange} placeholder="학교코드드" /><br />
                                    <input type="text" name="wr_school" value={formData.wr_school || ''} className="jil_form_input jil_w_450" onChange={handleChange} placeholder="학교명" style={{ marginTop: "2px" }} /> &nbsp;
                                    <input type="button" value="학교검색" onClick={() => setShowModal(true)} className="jil_state_btn" />
                                    <input type="text" name="wr_schooladdr" value={formData.wr_schooladdr || ''} className="jil_form_input jil_w_per_100" onChange={handleChange} placeholder="학교주소" style={{ marginTop: "2px" }} />

                                    {showModal && (
                                        <SchoolSearchModal
                                            onSelect={handleSelectSchool}
                                            onClose={() => setShowModal(false)}
                                        />
                                    )}
                                </div>

                                <div className="jil_form_field_subject">학년</div>
                                <div><input type="text" name="wr_grade" value={formData.wr_grade || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">전공</div>
                                <div><input type="text" name="wr_major" value={formData.wr_major || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">한국장학재단고객번호</div>
                                <div><input type="text" name="wr_jang_num" value={formData.wr_jang_num || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">본인명의 계좌 은행명</div>
                                <div><input type="text" name="wr_bank_nm" value={formData.wr_bank_nm || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">본인명의 계좌 계좌번호</div>
                                <div><input type="text" name="wr_bank_num" value={formData.wr_bank_num || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">평균성적</div>
                                <div><input type="text" name="wr_average" value={formData.wr_average || ''} className="jil_form_input jil_w_450" onChange={handleChange} /></div>
                            </div>
                        </div>

                        <div className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 보호자정보</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">전화번호</div>
                                <div><input type="text" name="wr_ptel" value={formData.wr_ptel || ''} className="jil_form_input jil_w_450" onChange={handleChange} maxLength={11} placeholder="'-'생략 숫자만 입력" /></div>
                            </div>
                        </div>

                        {/* 대학 신입생 파일첨부 s */}
                        <div id="scate1_area" className="jil_adm_form_area mt-2 hidden">
                            <div className="jil_adm_form_title">■ 대학 신입생 파일첨부</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">[필수]개인정보 수집 이용, 제3자 제공 동의서 1부(진흥원 서식)</div>
                                <div>
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

                                <div className="jil_form_field_subject">[필수]주민등록초본 1부(본인)</div>
                                <div>
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

                                <div className="jil_form_field_subject">[필수]주민등록초본 1부 (부모)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={aauploader3.getRootProps}
                                        getInputProps={aauploader3.getInputProps}
                                        isDragActive={aauploader3.isDragActive}
                                        files={aafiles3}
                                    />
                                    <div id="aafiles3">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "aafiles3")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수]가족관계증명서 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={aauploader4.getRootProps}
                                        getInputProps={aauploader4.getInputProps}
                                        isDragActive={aauploader4.isDragActive}
                                        files={aafiles4}
                                    />
                                    <div id="aafiles4">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "aafiles4")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 재학증명서 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={aauploader5.getRootProps}
                                        getInputProps={aauploader5.getInputProps}
                                        isDragActive={aauploader5.isDragActive}
                                        files={aafiles5}
                                    />
                                    <div id="aafiles5">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "aafiles5")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수]  성적증명서 1부<br />(해당 학년도 대학수학능력시험 성적표)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={aauploader6.getRootProps}
                                        getInputProps={aauploader6.getInputProps}
                                        isDragActive={aauploader6.isDragActive}
                                        files={aafiles6}
                                    />
                                    <div id="aafiles6">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "aafiles6")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수]  등록금 납부 영수증 1부(해당 학년도 1학기)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={aauploader7.getRootProps}
                                        getInputProps={aauploader7.getInputProps}
                                        isDragActive={aauploader7.isDragActive}
                                        files={aafiles7}
                                    />
                                    <div id="aafiles7">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "aafiles7")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수]  본인명의 통장사본 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={aauploader8.getRootProps}
                                        getInputProps={aauploader8.getInputProps}
                                        isDragActive={aauploader8.isDragActive}
                                        files={aafiles8}
                                    />
                                    <div id="aafiles8">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "aafiles8")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* 대학 신입생 파일첨부 e */}

                        {/* 대학 재학생 파일첨부 s */}
                        <div id="scate2_area" className="jil_adm_form_area mt-2 hidden">
                            <div className="jil_adm_form_title">■ 대학 재학생 파일첨부</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">[필수]개인정보 수집 이용, 제3자 제공 동의서 1부(진흥원 서식)</div>
                                <div>
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

                                <div className="jil_form_field_subject">[필수] 주민등록초본 1부(본인)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader2.getRootProps}
                                        getInputProps={abuploader2.getInputProps}
                                        isDragActive={abuploader2.isDragActive}
                                        files={abfiles2}
                                    />
                                    <div id="abfiles2">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles2")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 주민등록초본 1부(부모)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader3.getRootProps}
                                        getInputProps={abuploader3.getInputProps}
                                        isDragActive={abuploader3.isDragActive}
                                        files={abfiles3}
                                    />
                                    <div id="abfiles3">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles3")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 가족관계증명서 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader4.getRootProps}
                                        getInputProps={abuploader4.getInputProps}
                                        isDragActive={abuploader4.isDragActive}
                                        files={abfiles4}
                                    />
                                    <div id="abfiles4">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles4")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 재학증명서 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader5.getRootProps}
                                        getInputProps={abuploader5.getInputProps}
                                        isDragActive={abuploader5.isDragActive}
                                        files={abfiles5}
                                    />
                                    <div id="abfiles5">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles5")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 성적증명서 1부<br />(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader6.getRootProps}
                                        getInputProps={abuploader6.getInputProps}
                                        isDragActive={abuploader6.isDragActive}
                                        files={abfiles6}
                                    />
                                    <div id="abfiles6">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles6")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 등록금 납부 영수증 1부<br />(해당 학년도 1학기)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader7.getRootProps}
                                        getInputProps={abuploader7.getInputProps}
                                        isDragActive={abuploader7.isDragActive}
                                        files={abfiles7}
                                    />
                                    <div id="abfiles7">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles7")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 본인명의 통장사본 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={abuploader8.getRootProps}
                                        getInputProps={abuploader8.getInputProps}
                                        isDragActive={abuploader8.isDragActive}
                                        files={abfiles8}
                                    />
                                    <div id="abfiles8">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "abfiles8")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                
                                <div className="jil_form_field_subject">[선택]대학 학적부 1부(2024학년도 군복무 휴학자)</div>
                                <div>
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
                        {/* 대학 재학생 파일첨부 e */}

                        {/* 대학원 석사재학생 파일첨부 s */}
                        <div id="scate3_area" className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 대학원 석사재학생 파일첨부</div>
                            <div className="jil_adm_form_field_wrap">
                                
                                <div className="jil_form_field_subject">[필수]개인정보 수집 이용, 제3자 제공 동의서 1부(진흥원 서식)</div>
                                <div>
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

                                <div className="jil_form_field_subject">[필수] 주민등록초본 1부(본인)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader2.getRootProps}
                                        getInputProps={acuploader2.getInputProps}
                                        isDragActive={acuploader2.isDragActive}
                                        files={acfiles2}
                                    />
                                    <div id="acfiles2">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles2")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 주민등록초본 1부(부모)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader3.getRootProps}
                                        getInputProps={acuploader3.getInputProps}
                                        isDragActive={acuploader3.isDragActive}
                                        files={acfiles3}
                                    />
                                    <div id="acfiles3">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles3")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 가족관계증명서 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader4.getRootProps}
                                        getInputProps={acuploader4.getInputProps}
                                        isDragActive={acuploader4.isDragActive}
                                        files={acfiles4}
                                    />
                                    <div id="acfiles4">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles4")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 재학증명서 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader5.getRootProps}
                                        getInputProps={acuploader5.getInputProps}
                                        isDragActive={acuploader5.isDragActive}
                                        files={acfiles5}
                                    />
                                    <div id="acfiles5">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles5")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 성적증명서 1부<br />(직전 학기 성적증명서, 군복무 휴학자에 한하여 군복무 직전 학기 성적증명서)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader6.getRootProps}
                                        getInputProps={acuploader6.getInputProps}
                                        isDragActive={acuploader6.isDragActive}
                                        files={acfiles6}
                                    />
                                    <div id="acfiles6">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles6")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 등록금 납부 영수증 1부<br />(해당 학년도 1학기)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader7.getRootProps}
                                        getInputProps={acuploader7.getInputProps}
                                        isDragActive={acuploader7.isDragActive}
                                        files={acfiles7}
                                    />
                                    <div id="acfiles7">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles7")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 본인명의 통장사본 1부</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader8.getRootProps}
                                        getInputProps={acuploader8.getInputProps}
                                        isDragActive={acuploader8.isDragActive}
                                        files={acfiles8}
                                    />
                                    <div id="acfiles8">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles8")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 연구실적표 1부<br />(진흥원 서식, SCI급 논문만 인정)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader9.getRootProps}
                                        getInputProps={acuploader9.getInputProps}
                                        isDragActive={acuploader9.isDragActive}
                                        files={acfiles9}
                                    />
                                    <div id="acfiles9">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles9")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[필수] 연구실적 증빙서류</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader10.getRootProps}
                                        getInputProps={acuploader10.getInputProps}
                                        isDragActive={acuploader10.isDragActive}
                                        files={acfiles10}
                                    />
                                    <div id="acfiles10">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles10")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="jil_form_field_subject">[선택] 대학 학적부 1부<br />(해당 학년도 군복무 휴학 이력자)</div>
                                <div>
                                    <FileUploader
                                        getRootProps={acuploader11.getRootProps}
                                        getInputProps={acuploader11.getInputProps}
                                        isDragActive={acuploader11.isDragActive}
                                        files={acfiles10}
                                    />
                                    <div id="acfiles11">
                                        {formData.files
                                            ?.filter(file => file.wr_title === "acfiles11")
                                            .map((file, index) => (
                                                <div key={index}>
                                                    <button className="jil_state_btn">삭제</button>&nbsp;{file.file_rename}
                                                </div>
                                            ))}
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

