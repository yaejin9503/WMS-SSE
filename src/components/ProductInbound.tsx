"use client";
import { useState } from "react";
import ProductInboundForm from "./ProductInboundForm";
import ProductInboundExcel from "./ProductInboundExcel";

export default function ProductInbound() {
  const [isForm, setIsForm] = useState(true);

  return (
    <>
      <div className="flex justify-center my-4 text-sm">
        <button
          onClick={() => setIsForm(true)}
          className={`px-3 py-1 rounded-l-lg ${
            isForm ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          텍스트 입고 등록
        </button>
        <button
          onClick={() => setIsForm(false)}
          className={`px-3 py-1 rounded-r-lg ${
            !isForm ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          엑셀로 입고 등록
        </button>
      </div>
      {/* min-h-screen  */}
      <div className="bg-white flex flex-col items-center justify-start p-5">
        <div className="w-full max-w-md">
          {isForm && <ProductInboundForm />}
          {!isForm && <ProductInboundExcel />}
        </div>
      </div>
    </>
  );
}
