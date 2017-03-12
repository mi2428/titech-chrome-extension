$(function(){
  chrome.storage.sync.get(function(storage){
    if (storage.mode != "login-enable-btn") return;
    $('[name="usr_name"]:first').val(storage.secret["student-id"]);
    $('[name="usr_password"]:first').val(storage.secret["password"]);
    $('[name="OK"]:first').click();
  });
});
