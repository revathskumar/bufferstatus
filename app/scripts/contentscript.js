window.onload = function () {
  var access_token = document.getElementById("access_token").value;
  chrome.extension.sendMessage({access_token: access_token}, function (data) {
    window.close();
  });
};

