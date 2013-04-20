Buffer.Views.BufferView = Backbone.View.extend({
  initialize: function () {
    this.model.on('error', this.error, this);
    this.model.on('hide_message', this.hide_message, this);
  },
  events:{
    "submit form": "sendToBuffer",
    "click #logout": "logout",
    "click form img": "getCurrentTabUrl",
    "blur form textarea": "draft"
  },
  draft: function () {

  },
  logout: function () {
    this.model.resetAll();
    this.showLogin();
  },
  showLogin: function () {
    var authView = new Buffer.Views.AuthView({el: $("#buffer"), model: this.model});
    authView.render();
  },
  sendToBuffer: function (e) {
    this.model.trigger('hide_message');
    e.preventDefault();
    e.stopPropagation();
    var _this = this,
      text = $("#profiles textarea").val(),
      form_data = $("form").serialize();
    Backbone.ajax("https://api.bufferapp.com/1/updates/create.json",{
      type: "POST",
      data: form_data,
      success: function(data, textStatus, jqXHR){
        _this.success(data);
      },
      error: function(xhr, settings, message){
        _this.error(message);
      }
    });
    return false;
  },
  success: function (data) {
    $(".flash").html("Added to buffer").addClass('success').show();
    $("form textarea").val("");
  },
  error: function(message){
    $(".flash").html(message).addClass('error').show();
  },
  hide_message: function () {
    $(".flash").hide();
  },
  addProfiles: function(){
    var profiles = this.model.profiles.get();
    // call getProfiles if profiles are empty
    var df = document.createDocumentFragment();
    _.each(profiles, function(ele, index, list){
      var cb = document.createElement("input"),
        lb = document.createElement("label");
      cb.type = "checkbox";
      cb.name = "profile_ids[]";
      cb.value = ele.id;
      cb.checked = ele.default;
      lb.appendChild(cb);
      lb.appendChild(document.createTextNode(ele.service));
      df.appendChild(lb);
    });
    $("#profiles").append(df);
  },
  setAccessToken: function () {
    $("input[name=access_token]").val(this.model.get('token'));
  },
  getCurrentTabUrl: function (){
    this.model.trigger('hide_message');
    var _this = this;
    chrome.tabs.getSelected(null, function(tab) {
      Url.shorten(tab.url, function(status,url){
        if(status == 200){
          var textarea = $("form textarea");
          var text = textarea.val();
          if(text !== ''){
            text = text + ' ';
          }
          textarea.val( text + tab.title + " " + url);
        }else{
          _this.model.trigger('error', url);
        }
      });
    });
  },
  render:function(){
    $(this.el).empty().html($('#buffer_view').html());
    this.addProfiles();
    this.setAccessToken();
    return this;
  }
});
