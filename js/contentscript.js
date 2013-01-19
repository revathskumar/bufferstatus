window.onload = function () {
  var access_token = document.getElementById("access_token").value;
  console.log(access_token);
  chrome.extension.sendMessage({access_token: access_token}, function (data) {
    console.log("It time to close");
    window.close();
  });
};

