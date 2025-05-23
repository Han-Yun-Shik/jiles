"use client";

import { useEffect, useState } from "react";

type School = {
    wr_seq: number;
    wr_schnm: string;
    wr_address: string;
};

export default function SchoolSearchModalmid({ onSelect, onClose }: any) {
    const [schools, setSchools] = useState<School[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/wroute/schmid")
            .then((res) => res.json())
            .then((data) => setSchools(data));
    }, []);

    const filtered = schools.filter((s) =>
        s.wr_schnm.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-1">
            <div style={{ width: "800px", border: "1px solid #d1d1d1" }}>
                <div className="jil_sch_wrap">
                    <div style={{ fontSize: "19px", color: "#ffffff", lineHeight: "40px" }}>고등학교 검색</div>
                    <div style={{ textAlign: "right" }}><button onClick={onClose} className="btn btn-secondary">닫기</button></div>
                </div>
                <div className="p-1">
                    <input
                        type="text"
                        placeholder="학교명을 입력하세요"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="jil_form_input jil_w_200"
                    />
                </div>
                <div className="p-1">
                    <div className="overflow-y-auto" style={{ maxWidth: "800px", maxHeight: "350px" }}>
                        <table className="table table-bordered w-full" style={{ width: "500px" }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "70px", textAlign: "center", backgroundColor: "#efefef" }}>선택</th>
                                    <th style={{ textAlign: "center", backgroundColor: "#efefef" }}>학교명</th>
                                    <th style={{ textAlign: "center", backgroundColor: "#efefef" }}>주소</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((school) => (
                                    <tr key={school.wr_seq}>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                onClick={() => {
                                                    onSelect(school.wr_schnm);
                                                    onClose();
                                                }}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                선택
                                            </button>
                                        </td>
                                        <td style={{ textAlign: "left" }}>{school.wr_schnm}</td>
                                        <td style={{ textAlign: "left" }}>{school.wr_address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
