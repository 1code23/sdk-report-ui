import { Message } from "element-ui";
import moment from "moment";
//导出文件方法
/**
 *
 *  @param {list} 导出数据
 *  @param {tHeader} 导出数据对应的表头数据
 *  @param {filename} 导出文件名
 */
// export default function exportExcel({ tHeader = [], list = [], filename = '导出数据' }) {
export function exportExcel({
  tHeader = [],
  list = [],
  filename = "导出数据",
}) {
  if (!arguments[0].tHeader || !arguments[0].list) {
    Message.warning("导出表格传参格式有误");
    return Promise.reject(false);
  }
  return new Promise((resolve, reject) => {
    const nowTime = moment(new Date()).format("YYYYMMDDHHmmss");
    // tHeader: ['名称/name', '时间/time']
    let header = [],
      keys = [];
    tHeader.map((t) => {
      //   const splitArr = t.split("/") || [];
      //   header.push(splitArr[0]);
      //   keys.push(splitArr[1]);
      //   const splitArr = t.split("/") || [];
      header.push(t.label); //封装表格头部的中文
      keys.push(t.slot || t.key); //封装表格头部的英文
    });
    console.log(header, keys, list);
    import("@/vendor/Export2Excel")
      .then((excel) => {
        //导出表格头部内容（要与下面字段对照）
        const data = formatJson(list, keys);
        //保存excel
        excel.export_json_to_excel({
          header: header,
          data,
          //导出的文件名
          filename: `${filename}-${nowTime}`,
        });
        resolve(true);
      })
      .catch((err) => {
        reject(false);
      });
  });
}
function formatJson(list, keys) {
  return list.map((v) =>
    keys.map((j) => {
      return v[j];
    })
  );
}
