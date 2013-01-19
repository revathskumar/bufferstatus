window.Buffer = {
  Collections: {},
  Models: {},
  Views: {},
  init: function(){
    var user = new Buffer.Models.User();
    var authToken = user.get('token');

    if(authToken === "" || authToken === null){
      console.log("Hello authView");
      var authView = new Buffer.Views.AuthView({el: $("#buffer"), model: user});
      authView.render();
    }else{
      var bufferView = new Buffer.Views.BufferView({el: $("#buffer"), model: user});
      bufferView.render();
    }
  }
};

jQuery(function($){
  console.log("Hello init");
  Buffer.init();
});
