
/**
 * LINE Webhook で呼び出される関数
 * 
 * LINE とのやり取りはすべてここで処理される
 */
function doPost(e) {

  Logger.log("POST: " + JSON.stringify(e));

  // TODO メッセージ署名の検証

  // Webhook イベントを取得
  events = (JSON.parse(e.postData.contents)).events;

  Logger.log("Webhook events: " + JSON.stringify(events));

  // イベントオブジェクト分でループ
  Logger.log("num of event: " + events.length);
  for (ev of events) {
    Logger.log("event: " + JSON.stringify(ev));
    processEvent(ev);
  };

  return ContentService.createTextOutput(JSON.stringify({"content": "post ok"})).setMimeType(ContentService.MimeType.JSON);
}

function processEvent(ev) {

  // １つのイベントオブジェクトを処理
  switch(ev.type) {
    // イベント種類で分岐, とりあえず以下が必要かな？

    // message
    case "message":
      Logger.log("message event");
      processMessage(ev);
      break;
    // follow
    case "follow":
      Logger.log("follow event");
      break;
    // unfollow
    case "unfollow":
      Logger.log("unfollow event");
      break;
    // postback
    case "postback":
      Logger.log("postback event");
      break;
    default:
      Logger.log("other event: " + ev.type);
      break;
  }
}

function processMessage(ev) {

  if (ev.source.type === "user") {
    Logger.log("event from user, id: " + ev.source.userId);

    let userId = ev.source.userId;
    let replyToken = ev.replyToken;

    let param = parseMessage(ev.message);

    if (param !== null) {
      let sht = getTargetSheet(userId);

      if (param.command === "登録") {
        // SpreadSheet に追記
        //   日付 と 回数
        writeLiftingNumber(sht, param);

        // 返信
        let msg = "登録成功";
        Logger.log("reply message: " + msg);
        reply(replyToken, msg);
        
      } else if (param.command === "確認") {

        // 日付に対応するリフティング回数を取得
        let num = readLiftingNumber(sht, param);

        Logger.log("number: " + num);
        
        let msg;
        if (num === null) {
          msg = stringifyDate(parseDate(param.date)) + " には記録がありません";
        } else {
          msg = stringifyDate(parseDate(param.date)) + " のリフティング回数: " + num;
        }

        // 返信
        Logger.log("reply message: " + msg);
        reply(replyToken, msg);

      } else {
      Logger.log("invalid command: " + param.command);
      }
    } else {
      Logger.log("no parsed message");
    }
  } else {
    Logger.log("event soruce type is not user: " + ev.source.type);
  }

}
