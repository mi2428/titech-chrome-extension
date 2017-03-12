$(function(){
  $(".matrix-row > td").each(function(){
    const $td = $(this);
    const $input = $(document.createElement("input"));
    $input.attr({
      id: "_" + $td.attr("id"),
      class: "matrix-auth-secret secret fix-width fix-height",
      type: "text",
      maxlength: 1
    });
    $td.append($input);
  });

  chrome.storage.sync.get(function(storage){
    const secret = storage.secret;
    const mode = storage.mode;
    for (let key in secret) {
      $("#"+key).val(secret[key]);
    }
    if (mode) {
      $("#"+mode).addClass("selected");
    }
  });
});

$(function(){
  $("#description > .description-header").click(function(){
    $("#description > .description-text").toggle();
  });

  $("#import-btn").click(function(){
    const $area = $("#import-export-area");
    $area.val("");
    $area.attr("placeholder", "エクスポートしたマトリクスコードをここにペーストし、Enterで反映させます");
    $area.toggle();
    $area.select();
    $area.keypress(function(e){
      const matrix = $area.val().split(',');
      let invalid = false;
      if (e.keyCode != 13) return;
      if (matrix.length != 70) invalid = true;
      for (let m of matrix) {
        if ('A' <= m && m <= 'Z' && m != "ENTER") continue;
        else invalid = true;
      }
      if (invalid) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon/icon.png",
          title: "Titech Chrome Extension",
          message: "マトリクスコードに問題があるためインポートできません"
        });
      } else {
        $(".matrix-auth-secret").each(function(){
          const $this = $(this);
          const index = $this.attr("id").split("m")[1];
          $this.val(matrix[index]);
        });
      }
      $area.hide();
    });
  });

  $("#export-btn").click(function(){
    const $area = $("#import-export-area");
    let secret = "";
    let invalid = false;
    $(".matrix-auth-secret").each(function(){
      const $this = $(this);
      const m = $this.val();
      if ($this.hasClass("invalid") || m.length == 0) {
        invalid = true;
      }
      if (secret.length == 0) secret += m;
      else secret += "," + m;
    });
    if (invalid) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon/icon.png",
        title: "Titech Chrome Extension",
        message: "マトリクスコードに問題があるためエクスポートできません"
      });
    } else {
      $area.toggle();
      $area.val(secret);
      $area.removeAttr("placeholder");
      $area.select();
    }
  });

  $(".matrix-auth-secret").focus(function(){
    const $input = $(this);
    $input.keypress(function(e){
      const key = e.key.toUpperCase();
      $input.val(key);
      if ('A' <= key && key <= 'Z' && key != "ENTER") {
        $input.removeClass("invalid");
      } else {
        $input.addClass("invalid");
      }
    });
  });

  const $mode_ctrl_btn = $(".mode-ctrl-btn");
  $mode_ctrl_btn.click(function(){
    $mode_ctrl_btn.each(function(){
      $(this).removeClass("selected");
    });
    $(this).addClass("selected");
  });

  $("#clear-btn").click(function(){
    $(".secret").each(function(){
      $(this).val("");
    });
    $(".mode-ctrl-btn").each(function(){
      $(this).removeClass("selected");
    });
    chrome.storage.sync.clear(function(){
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon/icon.png",
        title: "Titech Chrome Extension",
        message: "ローカルストレージの設定を削除しました"
      });
    });
  });

  $("#save-btn").click(function(){
    const storage = new Object();
    storage.secret = new Object();
    $(".secret").each(function(){
      $this = $(this);
      storage.secret[$this.attr("id")] = $this.val();
    });
    $(".mode").each(function(){
      $this = $(this);
      if ($this.hasClass("selected")) {
        storage.mode = $this.attr("id");
      }
    });
    chrome.storage.sync.set(storage, function(){
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon/icon.png",
        title: "Titech Chrome Extension",
        message: "ローカルストレージに設定を保存しました"
      });
    });
  });
});
