/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

interface ProductTraceData {
  name: string;
  barcode: string;
  arrival_date: string;
  supplier: string;
  shipments: {
    shipment_date: string;
    customer: string;
  }[]; // 출고 이력 여러 개 가능
}

export default function ProductTraceForm() {
  const [barcode, setBarcode] = useState("");
  const [data, setData] = useState<ProductTraceData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcode) {
      alert("바코드를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/trace?barcode=${encodeURIComponent(barcode)}`
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "제품 조회 실패");
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      alert(`에러: ${err.message}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          제품 추적
        </h1>
        <form
          onSubmit={handleSearch}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="제품 바코드 입력 *"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white rounded-full cursor-pointer py-2 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "조회 중..." : "추적하기"}
          </button>
        </form>

        {data && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm text-sm text-gray-700">
            <p className="mb-1">
              <strong>제품명:</strong> {data.name}
            </p>
            <p className="mb-1">
              <strong>바코드:</strong> {data.barcode}
            </p>
            <p className="mb-1">
              <strong>입고 일자:</strong> {data.arrival_date}
            </p>
            <p className="mb-1">
              <strong>구매 거래처:</strong> {data.supplier}
            </p>
            {data.shipments.length > 0 ? (
              data.shipments.map((shipment, idx) => (
                <div key={idx} className="mt-2">
                  <p className="mb-1">
                    <strong>출고 일자:</strong> {shipment.shipment_date}
                  </p>
                  <p className="mb-1">
                    <strong>출고 거래처:</strong> {shipment.customer}
                  </p>
                </div>
              ))
            ) : (
              <p className="mt-2">출고 기록 없음</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
