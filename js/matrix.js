$(function(){
  const challenge = new Array();
  const response = new Array();
  const matrix_row = ['A','B','C','D','E','F','G','H','I','J'];
  challenge.push($("tr:nth-child(6) > th:nth-child(1)").text());
  challenge.push($("tr:nth-child(7) > th:nth-child(1)").text());
  challenge.push($("tr:nth-child(8) > th:nth-child(1)").text());
  chrome.storage.sync.get(function(storage){
    if (storage.mode == "login-disable-btn") return;
    for (let ch of challenge) {
      let c = matrix_row.indexOf(ch[1]), r = ch[3];
      let s = (r-1)*10 + c;
      response.push(storage.secret["_m"+s]);
    }
    $('[name="message4"]:first').val(response[0]);
    $('[name="message5"]:first').val(response[1]);
    $('[name="message6"]:first').val(response[2]);
    $('[name="OK"]:first').click();
  });
});
