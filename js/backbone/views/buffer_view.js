Buffer.Views.BufferView = Backbone.View.extend({
  initialize: function () {
  },
  events:{
    "submit form": "sendToBuffer",
    "click #logout": "logout",
    "click form img": "getCurrentTabUrl"
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
    $(".flash").html("Added to buffer").addClass('success');
    $("form textarea").val("");
  },
  error: function(message){
    $(".flash").html(message).addClass('error');
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
    chrome.tabs.getSelected(null, function(tab) {
      Url.shorten(tab.url, function(){
        $("form textarea").val( tab.title + " " + tab.url);
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
