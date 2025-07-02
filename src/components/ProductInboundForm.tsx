/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { clientRegisterProduct } from "@/api";
import { useState } from "react";

export default function ProductInboundForm() {
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    manufacture_date: "",
    arrival_date: "",
    supplier: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await clientRegisterProduct(form);
      alert("등록 성공!");
      console.log(data);
    } catch (err: any) {
      alert(`등록 실패: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          제품 입고 등록
        </h1>
        <form
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="flex space-x-2">
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="제품명 *"
              className="w-1/2 rouned-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
            <input
              type="text"
              name="barcode"
              value={form.barcode}
              placeholder="바코드 *"
              className="w-1/2 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1/5">생산일자</div>
            <input
              type="date"
              name="manufacture_date"
              value={form.manufacture_date}
              placeholder="생산 일자 *"
              className="w-4/5 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1/5">입고일자</div>
            <input
              type="date"
              name="arrival_date"
              value={form.arrival_date}
              placeholder="입고 일자 *"
              className="w-4/5 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="supplier"
            value={form.supplier}
            placeholder="구매 거래처 *"
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-full py-2 font-semibold hover:bg-blue-600 transition"
          >
            등록
          </button>
        </form>
      </div>
    </div>
  );
}
