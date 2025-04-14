"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { REGDATE_STR, WR_STATE_ARR, WR_SCATE_ARR } from "@/app/utils";

interface JilesData {
  wr_seq: number;
  wr_code: string;
  wr_year: string;
  wr_cate: string;
  wr_name: string;
  wr_ptel: string;
  wr_school: string;
  wr_grade: string;
  wr_major: string;
  wr_state: number;
  wr_regdate: string;
}

export default function Slist() {
  const [data, setData] = useState<JilesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/wroute/slist");
        if (Array.isArray(res.data)) {
          setData(res.data);
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

  const handleDelete = async (wr_code?: string) => {
    if (!wr_code) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await axios.delete(`/api/wroute/sdelete?id=${wr_code}`);
      if (res.status === 200) {
        alert("삭제되었습니다.");
        setData(prevData => prevData.filter(item => item.wr_code !== wr_code)); // 화면에서 즉시 제거
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>

      <div className="d-flex bg-secondary-subtle p-3">
        <div className="w-100 bg-white p-4 mt-4">
          <div className="jil_adm_c_hdr">
            <div className="jil_adm_c_hdr_left">성취장학금</div>
            <div className="jil_adm_c_hdr_right">
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">모두선택</button>
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">선택해제</button>
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">지급 선택</button>
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">미지급 선택</button>
              <button className="btn btn-secondary btn-sm jil_adm_mr_2">검색</button>
              <button className="btn btn-secondary btn-sm jil_adm_mr_2">엑셀파일 다운로드</button>
              <button className="btn btn-secondary btn-sm jil_adm_mr_2">초기화</button>
              <Link href="/wadm/swrite" className="btn btn-secondary btn-sm">신청서 등록</Link>
            </div>
          </div>

          {/* 검색 입력 필드 s */}
          {/* 검색 입력 필드 e */}

          {/* 목록 s */}
          <table className="table">
            <thead className="table-secondary">
              <tr>
                <th>&nbsp;</th>
                <th style={{ textAlign: "center", width: "50px", }}>번호</th>
                <th style={{ textAlign: "center", width: "80px", }}>연도</th>
                <th style={{ textAlign: "center" }}>장학분야</th>
                <th style={{ textAlign: "center" }}>이름</th>
                <th style={{ textAlign: "center" }}>학교</th>
                <th style={{ textAlign: "center" }}>학년</th>
                <th style={{ textAlign: "center" }}>전공</th>
                <th style={{ textAlign: "center" }}>연락처</th>
                <th style={{ textAlign: "center" }}>진행상태</th>
                <th style={{ textAlign: "center" }}>등록일</th>
                <th style={{ textAlign: "center", width: 200 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {

                return <tr key={index}>
                  <td style={{ textAlign: "center" }}><input className="form-check-input" type="checkbox" id="checkboxNoLabel" value="" aria-label="..." /></td>
                  <td style={{ textAlign: "center", fontSize: "13px" }}>{item.wr_seq}</td>
                  <td style={{ textAlign: "center" }}>{item.wr_year}</td>
                  <td style={{ textAlign: "center" }}>{WR_SCATE_ARR[item.wr_cate]}</td>
                  <td style={{ textAlign: "center" }}>{item.wr_name}</td>
                  <td style={{ textAlign: "center" }}>{item.wr_school}</td>
                  <td style={{ textAlign: "center" }}>{item.wr_grade}</td>
                  <td style={{ textAlign: "center" }}>{item.wr_major}</td>
                  <td style={{ textAlign: "center" }}>{item.wr_ptel}</td>
                  <td style={{ textAlign: "center" }}><button className="jil_state_btn">{WR_STATE_ARR[item.wr_state]}</button></td>
                  <td style={{ textAlign: "center" }}>{REGDATE_STR(item.wr_regdate)}</td>
                  <td style={{ textAlign: "center" }}>
                    <Link href={`/wadm/supdate/${item.wr_code}`} className="btn btn-sm btn-primary mx-1">수정/보기</Link>
                    <button onClick={() => handleDelete(item.wr_code)} className="btn btn-sm btn-danger">삭제</button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
          {/* 목록 e */}

          {/* 페이지네이션 s */}
          {/* 페이지네이션 e */}

        </div>
      </div>
    </>
  );
}

