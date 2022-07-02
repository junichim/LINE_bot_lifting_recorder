
const TARGET_FOLDER_ID = "folder id for spreadsheet file"; // /apps/tmp
const TARGET_FILE_NAME = "lifting_records";  // ファイル名
const SHEET_NAME = "lifting";                // シート名
const HEADER_DATE = "date";                  // ヘッダ, 日付
const HEADER_NUMBER = "number";              // ヘッダ、回数

/**
 * ユーザーID に対応する記録シートを取得する
 * 
 * 記録用ファイルがなければ、自動的に作成する
 * １ファイル内にユーザーID名のシートが複数作成されている
 */
function getTargetSheet(userId) {
  let sht = findRecordFile(userId);
  if (! sht) {
    sht = createRecordFile(userId);
  }
  return sht;
}

function findRecordFile(sheetName) {
  let folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  let files = folder.getFilesByName(TARGET_FILE_NAME);

  // 当該ファイルが複数ある場合は、最初に見つけたファイルとする
  let file = null;
  if (files.hasNext()) {
    file = files.next();
  } else {
    return null;
  }

  // スプレッドシート
  let ss = SpreadsheetApp.openById(file.getId());

  // シート名のシートがなければ追加
  let sht = ss.getSheetByName(sheetName);
  if (sht === null) {
    sht = ss.insertSheet()
    sht.setName(sheetName);
  }
  // ヘッダを設定
  setSheetHeader(sht);

  return sht;
}

function createRecordFile(sheetName) {
  let ss = SpreadsheetApp.create(TARGET_FILE_NAME);
  let file = DriveApp.getFileById(ss.getId());

  DriveApp.getFolderById(TARGET_FOLDER_ID).addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  // シート名を変更
  let sht = ss.getSheets()[0]; // 先頭のシート
  sht.setName(sheetName);

  // ヘッダを設定
  setSheetHeader(sht);

  return sht;
}

/**
 * シートのヘッダ行を設定する
 */
function setSheetHeader(sht) {  
  let r = sht.getRange(1, 1);
  r.setValue(HEADER_DATE);
  r.offset(0, 1).setValue(HEADER_NUMBER);
}

