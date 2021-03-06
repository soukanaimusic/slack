//音楽制作及びクリエイティブ業務の共同作業用Slackワークスペースの為のチャットボットです。

function doPost(e) {
  
  var slackApp = SlackApp.create("xoxb-1178519980918-1277387324436-YSMpltA0H6Zql0QqemqE3u58"); 
  
  //スプレッドシートを取得
  var spreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1IBaEilr-4BM9FnlGR7hwPAByfiVwdmJ7MWMPKtNB-GI/edit#gid=2099584798");
  
  //シートをシート名で取得
  var sheet = spreadsheet.getSheetByName("Record 01");
  
  //シート名を取得
  var sheetName = spreadsheet.getName();
  
  //シートの最後の行を取得
  var lastRow = sheet.getLastRow();
  
  //Slackの設定
  var channelId = "#general";
  var userName = "soukanaibot";
  var post;
  
  //各列のセルの値を取得
  for (var i=2; i<=lastRow; i++) {
    
    var date = sheet.getRange(i,1);
    var dateValue = date.getValue();
    
    var artistName = sheet.getRange(i,2);
    var artistNameValue = artistName.getValue();
  
    var trackTitle = sheet.getRange(i,3);
    var trackTitleValue = trackTitle.getValue();

    var streamingLink = sheet.getRange(i,4);
    var streamingLinkValue = streamingLink.getValue();

    var email = sheet.getRange(i,5);
    var emailValue = email.getValue();
    
    var message = sheet.getRange(i,6);
    var messageValue = message.getValue();

    if (dateValue > 0) {
      
      //日付をフォーマット
      var formattedDateValue = Utilities.formatDate(dateValue,'GMT','yyyy/MM/dd');
      //投稿メッセージ
      post = "Latest feedback request\n" + formattedDateValue + "\n" + "Artist Name: " + artistNameValue + "\n" + "Track Title: " + trackTitleValue + "\n" + "Streaming Link: " + streamingLinkValue + "\n" + "E-mail: " + emailValue + "\n" + "Message: " + "\n" + messageValue;
      
      //50行ごとにPDFを作成してメールに送信
      if (lastRow % 50 == 0) {
        
        //PDFを作成
        var pdf = spreadsheet.getAs("application/pdf").setName(sheetName + "pdf");
        
        //メールの設定
        var mail = "soukanaimusic@outlook.com";
        var subject = "Feedback Request";
        var body = sheetName + ".pdf" + "attached";
        var attachment = {attachments: pdf};
        
        //メールに送信
        GmailApp.sendEmail(mail, subject, body, attachment);
        //投稿メッセージ
        post = "Latest feedback request\n" + formattedDateValue + "\n" + "Artist Name: " + artistNameValue + "\n" + "Track Title: " + trackTitleValue + "\n" + "Streaming Link: " + streamingLinkValue + "\n" + "E-mail: " + emailValue + "\n" + "Message: " + "\n" + messageValue + "\n" + "It reached " + lastRow + " feedback requests so they were sent as a pdf";
        
      }
      
    }
    
  }
  
  //Slackに投稿
  slackApp.chatPostMessage("#general", post);
  
}
