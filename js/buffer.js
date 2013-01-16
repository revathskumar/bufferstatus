var BufferApp = (function($){

  function getProfiles() {
    $.get("https://api.bufferapp.com/1/profiles.json?access_token=" + getCode(),function(data){
        $.each(data,function(a,b){
          console.log(b);
        });
    });
  }

  function init() {
    code = getCode();
    if(code === "" || code === null){
      $("#get_code").show();
      $("#btn_submit").click(function(){
        setCode($("#get_code input").val());
      });
      return;
    }
    profiles = getProfiles();

  }

  function setCode(code){
    localStorage.setItem('code', code);
  }

  function getCode(){
    return localStorage.getItem('code');
  }

  return {
    setCode:setCode,
    getCode:getCode,
    init:init
  };
}(jQuery));


