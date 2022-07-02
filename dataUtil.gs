
const ST_POS = "a1";       // 記入開始位置
const COL_OFST_NUMBER = 1; // 回数記録列へのオフセット

function parseDate(dtstr) {
  return new Date(dtstr);
}
function stringifyDate(dt) {
  let y = dt.getFullYear();
  let m = ("00" + (dt.getMonth() + 1)).slice(-2);
  let d = ("00" + dt.getDate()).slice(-2);
  return y + "-" + m + "-" + d;
}

function readLiftingNumber(sht, param) {

  let target = param.date;

  Logger.log("target date: " + stringifyDate(target));

  let r = sht.getRange(ST_POS);
  do {
    // 日付チェック
    let src = new Date(r.getValue());

    //Logger.log("sheet date: " + stringifyDate(src));

    if (target.getFullYear() == src.getFullYear() && target.getMonth() == src.getMonth() && target.getDate() == src.getDate()) {
      // 見つけた
      let num = r.offset(0, COL_OFST_NUMBER).getValue();
      Logger.log("found, target date: " + stringifyDate(target) + ", number: " + num);
      return num;
    }

    // 次の行へ
    r = r.offset(1, 0);
  } while (! r.isBlank());

  Logger.log("not found, target date: " + stringifyDate(target));
  return null;
}

function writeLiftingNumber(sht, param) {

  let r = sht.getRange(ST_POS);

  if (! r.offset(1, 0).isBlank()) {
    r = r.getNextDataCell(SpreadsheetApp.Direction.DOWN);
  }

  // 最終行の次の空白行
  r = r.offset(1, 0);

  // 日付
  r.setValue(param.date);

  // 回数
  r.offset(0, COL_OFST_NUMBER).setValue(param.number);
}

