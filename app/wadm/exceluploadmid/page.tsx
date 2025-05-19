"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택하세요");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:3000/api/upload-excel-mid", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("엑셀 업로드 성공");
    } catch (err) {
      console.error(err);
      alert("업로드 실패");
    }
  };

  return (
    <div>
      <h2>엑셀 업로드</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
}
