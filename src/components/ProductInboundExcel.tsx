"use client";

import { parseInboundExcel } from "@/lib/parseInboundExcel";
import React, { useState } from "react";
// import { parseExcelFile } from "@/lib/parseExcelFile"; // 아까 만든 함수

export default function ProductInboundExcel() {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadResult(null);

      // 1️⃣ 파일 -> JSON 변환
      const parsed = await parseInboundExcel(file);
      console.log("변환된 데이터", parsed);

      // 2️⃣ 서버로 전송
      const res = await fetch("/api/products/bulk-insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "업로드 실패");
        // 업로드 실패 시 처리
      }

      setUploadResult("모든 데이터가 성공적으로 등록되었습니다.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setUploadResult(`에러: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        입고 엑셀 등록
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        {uploading && (
          <p className="text-blue-500 text-sm text-center">업로드 중...</p>
        )}
        {uploadResult && (
          <p
            className={`text-sm text-center ${
              uploadResult.startsWith("에러")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {uploadResult}
          </p>
        )}
      </div>
    </div>
  );
}
