Buffer.Views.AuthView = Backbone.View.extend({
  events:{
    "click #connect": "connectBuffer",
    "click #btn_submit": "saveAuthToken"
  },
  initialize: function(options){
    this.model.on('error', this.showError, this);
    // this.model.on('success', this.showBuffer, this);
  },
  getMessage: function () {
    var _this = this;
    chrome.extension.onMessage.addListener(function (request) {
      console.log(request);
      _this.saveAuthToken(request);
    });
  },
  connectBuffer: function() {
    this.popup = window.open(
      "http://localhost:3000/auth/buffer/",
      "Buffer", "width=480,height=470,left=400,top=100"
    );
  },
  saveAuthToken: function(request){
    console.log(request.access_token);
    var token = request.access_token || $("#get_code input:text").val().trim();
    console.log(token);
    if(token !== "" && token !== null){
      this.model.save({token:token},{success: function(model){
        model.get('token');
        model.getUser();
      }});
    }else{
      this.model.trigger('error',"Invalid Token");
    }
    this.popup.close();
  },
  showError: function(message){
    this.model.resetAll();
    $(".flash").html(message).addClass('error');
  },
  showBuffer: function () {
    var bufferView = new Buffer.Views.BufferView({el: $("#buffer"), model: this.model});
    bufferView.render();
  },
  render: function(){
    $(this.el).empty().html($('#auth_view').html());
    return this;
  }
});
