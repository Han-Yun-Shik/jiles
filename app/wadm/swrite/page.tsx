"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
import CustomCheckbox from "@/components/ui/checkbox";

// 여기에 추가
declare global {
    interface Window {
        daum: any;
    }
}

export default function Slist() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        wr_year: "",
        wr_cate: "",
        wr_name: "",
        wr_birthy: "",
        wr_birthm: "",
        wr_birthd: "",
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
        wr_state: 1,
    });
    const [agreed, setAgreed] = useState(false)
    const [daumPostLoaded, setDaumPostLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [years, setYears] = useState<number[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);

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

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 장학구분별 필수 파일 체크
        if (formData.wr_cate === "scate1" && aafiles1.length === 0) {
            alert("대학 신입생은 [필수] 개인정보 파일을 첨부해야 합니다.");
            return;
        }
        if (formData.wr_cate === "scate1" && aafiles2.length === 0) {
            alert("대학 신입생은 [필수] 주민등록초본 1부(본인) 파일을 첨부해야 합니다.");
            return;
        }

        if (formData.wr_cate === "scate2" && abfiles1.length === 0) {
            alert("대학 재학생은 [필수] 개인정보 파일을 첨부해야 합니다.");
            return;
        }

        if (formData.wr_cate === "scate3" && acfiles1.length === 0) {
            alert("대학원 석사재학생은 [필수] 개인정보 파일을 첨부해야 합니다.");
            return;
        }

        const data = new FormData();
        data.append("wr_year", formData.wr_year);
        data.append("wr_cate", formData.wr_cate);
        data.append("wr_name", formData.wr_name);
        data.append("wr_birth", formData.wr_birthy + "-" + formData.wr_birthm + "-" + formData.wr_birthd);
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
            const response = await axios.post("/api/wroute/swrite", data, {
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
                        <div className="jil_adm_c_hdr_left">성취장학금 신청서 제출</div>
                        <div className="jil_adm_c_hdr_right">
                            <button onClick={handleSubmit} className="btn btn-secondary btn-sm jil_adm_mr_2">등록</button>
                            <Link href="/wadm/slist" className="btn btn-secondary btn-sm">목록</Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="jil_adm_form_area">
                            <div className="jil_adm_form_title">■ 장학구분</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">년도</div>
                                <div><input type="text" name="wr_year" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">장학분야</div>
                                <div>
                                    <select
                                        name="wr_cate"
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
                                        value={formData.wr_state}
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
                            </div>
                        </div>

                        <div className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 학생정보</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">신청자 성명</div>
                                <div><input type="text" name="wr_name" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">신청자 생년월일</div>
                                <div style={{ position: "relative" }}>

                                    <select
                                        name="wr_birthy"
                                        className="jil_form_select jil_w_120"
                                        value={formData.wr_birthy}
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
                                        value={formData.wr_birthm}
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
                                        value={formData.wr_birthd}
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
                                    <input type="text" name="wr_post" value={formData.wr_post} className="jil_form_input jil_w_120" onChange={handleChange} placeholder="우편번호" readOnly />&nbsp;
                                    <input type="button" value="주소검색" onClick={handleAddressSearch} className="jil_state_btn" />
                                    <br />
                                    <input type="text" name="wr_address" value={formData.wr_address} className="jil_form_input jil_w_per_100  mt-2" onChange={handleChange} placeholder="도로명 주소" readOnly />
                                    <input type="text" name="wr_detailaddress" className="jil_form_input jil_w_per_100  mt-2" onChange={handleChange} placeholder="상세주소" />
                                </div>

                                <div className="jil_form_field_subject">학교</div>
                                <div>
                                    <input type="text" name="wr_schoolcode" value={formData.wr_schoolcode} className="jil_form_input jil_w_120" onChange={handleChange} placeholder="학교코드" /><br />
                                    <input type="text" name="wr_school" value={formData.wr_school} className="jil_form_input jil_w_450" onChange={handleChange} placeholder="학교명" style={{ marginTop: "2px" }} /> &nbsp;
                                    <input type="button" value="학교검색" onClick={() => setShowModal(true)} className="jil_state_btn" />
                                    <input type="text" name="wr_schooladdr" value={formData.wr_schooladdr} className="jil_form_input jil_w_per_100" onChange={handleChange} placeholder="학교주소" style={{ marginTop: "2px" }} />

                                    {showModal && (
                                        <SchoolSearchModal
                                            onSelect={handleSelectSchool}
                                            onClose={() => setShowModal(false)}
                                        />
                                    )}
                                </div>

                                <div className="jil_form_field_subject">학년</div>
                                <div><input type="text" name="wr_grade" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">전공</div>
                                <div><input type="text" name="wr_major" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">한국장학재단고객번호</div>
                                <div><input type="text" name="wr_jang_num" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">본인명의 계좌 은행명</div>
                                <div><input type="text" name="wr_bank_nm" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">본인명의 계좌 계좌번호</div>
                                <div><input type="text" name="wr_bank_num" className="jil_form_input jil_w_450" onChange={handleChange} /></div>

                                <div className="jil_form_field_subject">평균성적</div>
                                <div>
                                    <input type="text" name="wr_average" className="jil_form_input jil_w_450" onChange={handleChange} />
                                    <div id="wr_average_scate1" className="jil_color_red">2과목 평균최고점수</div>
                                    <div id="wr_average_scate2" className="jil_color_red">학점 4.5 만점 기준 전과목 평균점수</div>
                                    <div id="wr_average_scate3" className="jil_color_red">학점 4.5 만점 기준 전과목 평균점수</div>
                                </div>
                            </div>
                        </div>

                        <div className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 보호자정보</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">전화번호</div>
                                <div><input type="text" name="wr_ptel" className="jil_form_input jil_w_450" onChange={handleChange} maxLength={11} placeholder="'-'생략 숫자만 입력" /></div>
                            </div>
                        </div>

                        {/* 대학 신입생 파일첨부 s */}
                        <div id="scate1_area" className="jil_adm_form_area mt-2 hidden">
                            <div className="jil_adm_form_title">■ 대학 신입생 파일첨부</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">[필수]개인정보 수집 이용, 제3자 제공 동의서 1부(진흥원 서식)</div>
                                <FileUploader
                                    getRootProps={aauploader1.getRootProps}
                                    getInputProps={aauploader1.getInputProps}
                                    isDragActive={aauploader1.isDragActive}
                                    files={aafiles1}
                                    required={formData.wr_cate === "scate1"}
                                />
                                <div className="jil_form_field_subject">[필수]주민등록초본 1부(본인)</div>
                                <FileUploader
                                    getRootProps={aauploader2.getRootProps}
                                    getInputProps={aauploader2.getInputProps}
                                    isDragActive={aauploader2.isDragActive}
                                    files={aafiles2}
                                    required={formData.wr_cate === "scate1"}
                                />
                            </div>
                        </div>
                        {/* 대학 신입생 파일첨부 e */}

                        {/* 대학 재학생 파일첨부 s */}
                        <div id="scate2_area" className="jil_adm_form_area mt-2 hidden">
                            <div className="jil_adm_form_title">■ 대학 재학생 파일첨부</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">[필수]개인정보 수집 이용, 제3자 제공 동의서 1부(진흥원 서식)</div>
                                <FileUploader
                                    getRootProps={abuploader1.getRootProps}
                                    getInputProps={abuploader1.getInputProps}
                                    isDragActive={abuploader1.isDragActive}
                                    files={abfiles1}
                                    required={formData.wr_cate === "scate2"}
                                />
                                <div className="jil_form_field_subject">[선택]대학 학적부 1부(2024학년도 군복무 휴학자)</div>
                                <FileUploader
                                    getRootProps={abuploader9.getRootProps}
                                    getInputProps={abuploader9.getInputProps}
                                    isDragActive={abuploader9.isDragActive}
                                    files={abfiles9}
                                />
                            </div>
                        </div>
                        {/* 대학 재학생 파일첨부 e */}

                        {/* 대학원 석사재학생 파일첨부 s */}
                        <div id="scate3_area" className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 대학원 석사재학생 파일첨부</div>
                            <div className="jil_adm_form_field_wrap">
                                <div className="jil_form_field_subject">[필수]개인정보 수집 이용, 제3자 제공 동의서 1부(진흥원 서식)</div>
                                <FileUploader
                                    getRootProps={acuploader1.getRootProps}
                                    getInputProps={acuploader1.getInputProps}
                                    isDragActive={acuploader1.isDragActive}
                                    files={acfiles1}
                                    required={formData.wr_cate === "scate3"}
                                />
                            </div>
                        </div>
                        {/* 대학원 석사재학생 파일첨부 e */}

                        {/* 동의 사항 s */}
                        <div className="jil_adm_form_area mt-2">
                            <div className="jil_adm_form_title">■ 학자금(성취 장학금) 중복지원방지 안내문</div>
                            <div>
                                <CustomCheckbox
                                    id="terms"
                                    checked={agreed}
                                    onCheckedChange={(checked) => setAgreed(!!checked)}
                                />
                            </div>
                            <div className="jil_agree_wrap">내용 작성...</div>
                        </div>
                        {/* 동의 사항 e */}

                        <div className="jil_adm_btn_wrap">
                            <button disabled={!agreed} className="btn btn-success">
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

