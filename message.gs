
const ENDPOINT_LINE_REPLAY = "https://api.line.me/v2/bot/message/reply";
const CHANNEL_ACCESS_TOKEN = "your channel access token";

function parseMessage(msgobj) {
  
  Logger.log("parseMessage: " + JSON.stringify(msgobj));

  if (msgobj.type === "text") {
    let msg = msgobj.text;

    // 日付, 回数 のフォーマットを想定
    let v = msg.split(",");
    Logger.log("splited message: " + v);

    let cmd = v[0];
    switch(cmd) {
      case "登録":
        if (v.length == 3) {
          let dt = new Date(v[1]);
          let number = parseInt(v[2]);

          let res = {"command": cmd, "date": dt, "number": number};
          Logger.log("parseMessage result: " + JSON.stringify(res));
          return res;
        }
        break;
      case "確認":
        if (v.length == 2) {
          let dt = new Date(v[1]);

          let res = {"command": cmd, "date": dt};          
          Logger.log("parseMessage result: " + JSON.stringify(res));
          return res;
        }
        break;
      case "グラフ":
        // TODO
        break;
      default:
    }
  }
  Logger.log("parseMessage no result");
  return null;
}

function reply(replyToken, message) {

  let data = {
    "replyToken": replyToken,
    "messages": [
      {
        "type": "text",
        "text": message,
      },
    ]
  };
  UrlFetchApp.fetch(ENDPOINT_LINE_REPLAY, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    "method" : "post",
    "payload" : JSON.stringify(data),
  });

}
