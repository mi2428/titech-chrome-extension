$(function(){
  $("#login-wifi-btn").click(function(){
    chrome.storage.sync.get(function(storage){
      const endpoint = "https://wlanauth.noc.titech.ac.jp/login.html";
      const authform = {
        username: storage.secret["student-id"],
        password: storage.secret["password"],
        buttonClicked: 4
      };
      $.post(endpoint, authform, function(data){
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon/icon.png",
          title: "Titech Chrome Extension",
          message: "リクエストを送信しました"
        });
      });
    });
  });

  $("#login-portal-btn").click(function(){
    const portal = "https://portal.nap.gsic.titech.ac.jp/GetAccess/Login?Template=userpass_key&AUTHMETHOD=UserPassword";
    chrome.tabs.create({
      "url": portal,
      "active": true
    });
  });

  $("#option-btn").click(function(){
    chrome.tabs.create({
      "url": chrome.extension.getURL("options.html"),
    });
  });
});
