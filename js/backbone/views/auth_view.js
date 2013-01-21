Buffer.Views.AuthView = Backbone.View.extend({
  events:{
    "click #connect": "connectBuffer",
    "click #btn_submit": "saveAuthToken"
  },
  initialize: function(options){
    this.model.on('error', this.showError, this);
  },
  getMessage: function () {
    var _this = this;
    chrome.extension.onMessage.addListener(function (request, sender) {
      _this.saveAuthToken(request, sender.tab);
    });
  },
  connectBuffer: function() {
    window.open(
      "http://bufferstatus.herokuapp.com/auth/buffer/",
      "Buffer", "width=480,height=470,left=400,top=100"
    );
  },
  saveAuthToken: function(request, tab){
    var token = request.access_token;
    if(token !== "" && token !== null){
      this.model.save({token:token},{success: function(model){
        model.get('token');
        model.getUser();
      }});
    }else{
      this.model.trigger('error',"Invalid Token");
    }
    chrome.tabs.remove(tab.id);
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
