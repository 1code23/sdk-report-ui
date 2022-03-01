import FileSaver from "file-saver";
import XLSX from "xlsx";
// 将base64的图片转换成url
export function base64ImgtoUrl(dataurl, filename = "file") {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let suffix = mime.split("/")[1];
  let bstr = window.atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const imgFile = new File([u8arr], `${filename}.${suffix}`, {
    type: mime,
  });
  const url = window.URL.createObjectURL(imgFile);
  return url;
}
//日期格式化 dateFormat("YYYY-mm-dd HH:MM", date)
export function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
// 获取上个月
export function getPreMonth(date, str = "-") {
  const arr = date.split(str);
  const year = arr[0]; //获取当前日期的年份
  const month = arr[1]; //获取当前日期的月份
  const day = arr[2]; //获取当前日期的日
  let year2 = year;
  let month2 = parseInt(month) - 1;
  if (month2 == 0) {
    year2 = parseInt(year2) - 1;
    month2 = 12;
  }
  let day2 = day;
  const days2 = new Date(year2, month2, 0).getDate(); //获取上个月的天数
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = "0" + month2;
  }
  let t2 = year2 + str + month2 + str + day2;
  return t2;
}
//获取两个日期之间的相差的天数
// * @param dateString1  开始日期 yyyy-MM-dd
//  * @param dateString2  结束日期 yyyy-MM-dd
//  * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
export function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1);
  var endDate = Date.parse(dateString2);
  if (startDate > endDate) {
    return 0;
  }
  if (startDate == endDate) {
    return 1;
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  return days;
}
// 下载Blob类型的excel
export function downloadExcel(obj, name) {
  const blob = new Blob([obj], {
    type: "application/vnd.ms-excel,charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  const today = new Date().toLocaleDateString().split("/").join("-");
  const fileName = name + "-" + today;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 三位数字分割逗号
export function toThousands(num) {
  var result = "",
    counter = 0;
  num = (num || 0).toString();
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num.charAt(i) + result;
    if (!(counter % 3) && i != 0) {
      result = "," + result;
    }
  }
  return result;
}

//表格导出
export function downTable(tableName) {
  /* 从表生成工作簿对象 */
  let wb = XLSX.utils.table_to_book(document.querySelector(`#${tableName}`));
  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      //Blob 对象表示一个不可变、原始数据的类文件对象。
      //Blob 表示的不一定是JavaScript原生格式的数据。
      //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: "application/octet-stream" }),
      //设置导出文件名称
      `${tableName}.xlsx`
    );
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
}

//表格导出2
export function downTableCusName(tableName, sheetName) {
  /* 从表生成工作簿对象 */
  let wb = XLSX.utils.table_to_book(document.querySelector(`#${tableName}`));
  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      //Blob 对象表示一个不可变、原始数据的类文件对象。
      //Blob 表示的不一定是JavaScript原生格式的数据。
      //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: "application/octet-stream" }),
      //设置导出文件名称
      `${sheetName}.xlsx`
    );
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout);
  }
  return wbout;
}

// 秒转换为时分秒格式
export function changeDateTime(s) {
  var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
  var hour = Math.floor((s - day * 24 * 3600) / 3600);
  var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
  var second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = parseInt(second);
    second = "0" + second;
  }
  return hour + ":" + minute + ":" + second;
}

// 获取本周周一的年月日 getMon(Date.now())
export function getMon(date) {
  let nowTemp = new Date(date); //当前时间

  let oneDayLong = 24 * 60 * 60 * 1000; //一天的毫秒数

  let c_time = nowTemp.getTime(); //当前时间的毫秒时间

  let c_day = nowTemp.getDay() || 7; //当前时间的星期几

  let m_time = c_time - (c_day - 1) * oneDayLong; //当前周一的毫秒时间

  let monday = new Date(m_time); //设置周一时间对象

  let m_year = monday.getFullYear();

  let m_month = monday.getMonth() + 1;
  m_month = m_month < 10 ? "0" + m_month : m_month;

  let m_date = monday.getDate();
  m_date = m_date < 10 ? "0" + m_date : m_date;

  return m_year + "-" + m_month + "-" + m_date;
}
// 时间戳转字符串方法 getDateString(1644768000000)
export function getDateString(stamp) {
  let d = new Date(parseInt(stamp, 0));
  let month =
    d.getMonth() + 1 < 10 ? 0 + "" + (d.getMonth() + 1) : d.getMonth() + 1;
  let day = d.getDate() < 10 ? 0 + "" + d.getDate() : d.getDate();
  let hour = d.getHours() < 10 ? 0 + "" + d.getHours() : d.getHours();
  let minute = d.getMinutes() < 10 ? 0 + "" + d.getMinutes() : d.getMinutes();
  let second = d.getSeconds() < 10 ? 0 + "" + d.getSeconds() : d.getSeconds();
  let dateString =
    d.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    " " +
    hour +
    ":" +
    minute +
    ":" +
    second;
  return dateString;
}
// 获取当前日期之前几天后之后几天的日期 getDay(-7)当前日期7天前的日期
export function getDay(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds);
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
}
// 和getDay()配合使用
export function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}
