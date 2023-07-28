import axios from "axios";
import cheerio from "cheerio";
import { log } from "console";
import iconv from "iconv-lite";
import XLSX from "xlsx";

const getHtml = async () => {
  try {
    return await axios.get(
      "http://ratio.uwayapply.com/Sl5KOkJKJmB9YWhKemZUZg==",
      { responseType: "arraybuffer" }
    );
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then((response) => {
    const html = iconv.decode(response.data, "EUC-KR");
    let ulList = [];
    const $ = cheerio.load(html);
    const $bodyList = $("#Div_001 > table:nth-child(3)");

    $bodyList.each(function (i, elem) {
      ulList[i] = {
        title: $(this).find("td:nth-child(1)").text(),
        recruit: $(this).find("td:nth-child(2)").text(),
        support: $(this).find("td:nth-child(3)").text(),
        rate: $(this).find("td:nth-child(4)").text(),
      };
    });

    const data = ulList.filter((n) => n.title);
    return data;
  })
  .then((res) => {
    // 데이터를 엑셀 파일로 변환
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(res);
    const sheetName = "Sheet1";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 엑셀 파일 저장
    const excelFileName = "data.xlsx";
    XLSX.writeFile(workbook, excelFileName);

    log(`데이터를 ${excelFileName} 파일로 추출했습니다.`);
  });
