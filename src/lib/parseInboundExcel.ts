/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";

export const parseInboundExcel = async (file: File) => {
  return new Promise<any[]>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        reject("파일 읽기 실패");
        return;
      }

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
      }) as string[][];

      // 첫 행은 헤더
      const [header, ...rows] = json;

      const result = rows.map((row) => ({
        name: row[0],
        barcode: row[1],
        arrival_date: new Date(row[2]).toISOString().split("T")[0], // 날짜 형식 변환
        supplier: row[3],
      }));

      resolve(result);
    };

    reader.onerror = () => reject("파일 읽기 실패");
    reader.readAsBinaryString(file);
  });
};
