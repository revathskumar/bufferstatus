var Url = {
  shorten: function (url,callback) {
    if(["",null,undefined].indexOf(url) >= 0) return false
    var url = "http://api.bit.ly/v3/shorten";
    var params = {
      format: 'json',
      longUrl: url,
      login: 'chromedbird',
      apiKey: 'R_aa77c64a8258cf704e7fa361555a4d81'
    };

    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      dataType: 'json',
      success: function(data, status_param) {
        var status = data.status_code;
        if(status == 200) {
          callback(0, data.data.url);
        } else {
          callback(status, data.status_txt);
        }
      },
      error: function (request, status, error) {
        callback(-1, chrome.i18n.getMessage("ajaxFailed"));
      }
    });
  }
};

root = module.exports || window.Url
root.shorten = Url.shorten;
