Buffer.Views.AuthView = Backbone.View.extend({
  events:{
    "click #connect": "connectBuffer",
    "click #btn_submit": "saveAuthToken"
  },
  initialize: function(options){
    this.model.on('error', this.showError, this);
    this.model.on('success', this.showBuffer, this);
  },
  connectBuffer: function() {
    window.open(
      "http://localhost:3000/auth/buffer/",
      "Buffer", "width=480,height=470,left=400,top=100"
    );
  },
  saveAuthToken: function(){
    var token = $("#get_code input:text").val().trim();
    if(token !== "" && token !== null){
      this.model.save({token:token},{success: function(model){
        model.get('token');
        model.getUser();
      }});
    }else{
      this.model.trigger('error',"Invalid Token");
    }
  },
  showError: function(message){
    this.model.resetAll();
    $("#error").html(message);
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
