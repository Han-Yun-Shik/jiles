"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { REGDATE_YMD_STR, WR_STATE_ARR, WR_SCATE_ARR } from "@/app/utils";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination"; // 추가

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
  const router = useRouter();
  const [data, setData] = useState<JilesData[]>([]);
  const [wyear, setWyear] = useState("");
  const [wcate, setWcate] = useState("");
  const [wname, setWname] = useState("");
  const [wstate, setWstate] = useState("");

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchData = async (searchParamsObj?: {
    wyear?: string;
    wcate?: string;
    wname?: string;
    wstate?: string;
    page?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      const page = searchParamsObj?.page || currentPage;

      if (searchParamsObj?.wyear) params.append("wr_year", searchParamsObj.wyear);
      if (searchParamsObj?.wcate) params.append("wr_cate", searchParamsObj.wcate);
      if (searchParamsObj?.wname) params.append("wr_name", searchParamsObj.wname);
      if (searchParamsObj?.wstate) params.append("wr_state", searchParamsObj.wstate);
      params.append("page", page.toString());
      params.append("limit", itemsPerPage.toString());

      const res = await axios.get(`/api/wroute/slist?${params.toString()}`);
      if (res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
        setTotalCount(res.data.total);
      } else {
        console.error("응답 형식이 올바르지 않습니다:", res.data);
      }
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
    }
  };

  const updateUrl = (newParams: URLSearchParams) => {
    router.replace(`/wadm/slist?${newParams.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (wyear) params.append("wyear", wyear);
    if (wcate) params.append("wcate", wcate);
    if (wname) params.append("wname", wname);
    if (wstate) params.append("wstate", wstate);
    params.append("currentPage", "1");

    updateUrl(params);
  };

  const handleReset = () => {
    router.replace("/wadm/slist");
    setWyear("");
    setWcate("");
    setWname("");
    setWstate("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (wyear) params.append("wyear", wyear);
    if (wcate) params.append("wcate", wcate);
    if (wname) params.append("wname", wname);
    if (wstate) params.append("wstate", wstate);
    params.append("currentPage", page.toString());

    updateUrl(params);
  };

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
      {/* Suspense로 SearchParamsFetcher 감싸기 */}
      <Suspense fallback={<div>Loading SearchParams...</div>}>
        <SearchParamsFetcher
          setWyear={setWyear}
          setWcate={setWcate}
          setWname={setWname}
          setWstate={setWstate}
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
        />
      </Suspense>

      <div className="d-flex bg-secondary-subtle p-3">
        <div className="w-100 bg-white p-4 mt-4">
          <div className="jil_adm_c_hdr">
            <div className="jil_adm_c_hdr_left">성취장학금</div>
            <div className="jil_adm_c_hdr_right">
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">모두선택</button>
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">선택해제</button>
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">지급 선택</button>
              <button className="btn btn-outline-secondary btn-sm jil_adm_mr_2">미지급 선택</button>
              <button onClick={handleSearch} className="btn btn-secondary btn-sm jil_adm_mr_2">검색</button>
              <button onClick={handleReset} className="btn btn-secondary btn-sm jil_adm_mr_2">초기화</button>
              {/* <button className="btn btn-secondary btn-sm jil_adm_mr_2">엑셀파일 다운로드</button> */}
              {/* <Link href="/wadm/swrite" className="btn btn-secondary btn-sm">신청서 등록</Link> */}
            </div>
          </div>

          {/* 검색 입력 필드 s */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="bg-white rounded-xl shadow p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="wyear" className="block text-sm font-medium text-gray-700 mb-1">년도</label>
                <input
                  type="text"
                  id="wyear"
                  value={wyear}
                  onChange={(e) => setWyear(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YYYY"
                />
              </div>

              <div>
                <label htmlFor="wcate" className="block text-sm font-medium text-gray-700 mb-1">장학분야</label>
                <select
                  id="wcate"
                  value={wcate}
                  onChange={(e) => setWcate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">장학분야 선택</option>
                  {Object.entries(WR_SCATE_ARR).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="wname" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  type="text"
                  id="wname"
                  value={wname}
                  onChange={(e) => setWname(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이름 입력"
                />
              </div>

              <div>
                <label htmlFor="wstate" className="block text-sm font-medium text-gray-700 mb-1">진행상태</label>
                <select
                  id="wstate"
                  value={wstate}
                  onChange={(e) => setWstate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </form>
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
                  <td style={{ textAlign: "center" }}>{REGDATE_YMD_STR(item.wr_regdate)}</td>
                  <td style={{ textAlign: "center" }}>
                    <Link
                      href={{
                        pathname: `/wadm/supdate/${item.wr_code}`,
                        query: {
                          wyear,
                          wcate,
                          wname,
                          wstate,
                          currentPage: currentPage.toString(),
                        },
                      }}
                      className="btn btn-sm btn-primary mx-1"
                    >
                      수정
                    </Link>
                    <button onClick={() => handleDelete(item.wr_code)} className="btn btn-sm btn-danger">삭제</button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
          {/* 목록 e */}

          {/* 페이지네이션 s */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          {/* 페이지네이션 e */}

        </div>
      </div>
    </>
  );
}
function SearchParamsFetcher({ setWyear, setWcate, setWname, setWstate, setCurrentPage, fetchData }: any) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const wyear = searchParams.get("wyear") || "";
    const wcate = searchParams.get("wcate") || "";
    const wname = searchParams.get("wname") || "";
    const wstate = searchParams.get("wstate") || "";
    const currentPageQuery = parseInt(searchParams.get("currentPage") || "1", 10);

    setWyear(wyear);
    setWcate(wcate);
    setWname(wname);
    setWstate(wstate);
    setCurrentPage(currentPageQuery);

    fetchData({ wyear, wcate, wname, wstate, page: currentPageQuery });
  }, [searchParams]);

  return null;
}
