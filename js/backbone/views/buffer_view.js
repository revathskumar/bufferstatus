Buffer.Views.BufferView = Backbone.View.extend({
  initialize: function () {
    this.model.on('error', this.error, this);
    this.model.on('hide_message', this.hide_message, this);
    this.status = new Buffer.Models.Status();
    this.status.on('change:text', this.update_char_count, this);
  },
  events:{
    "submit form": "sendToBuffer",
    "click #logout": "logout",
    "click form img": "getCurrentTabUrl",
    "blur form textarea": "draft",
    'keyup form textarea': 'update_model'
  },
  draft: function (e) {
    localStorage.setItem('buffer_app_draft', $(e.target).val());
  },
  update_model: function(e) {
    this.status.set('text', $(e.target).val());
  },
  update_char_count: function(e) {
    $('.char-count').html(this.status.get('text').length);
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
    localStorage.setItem('buffer_app_draft', '');
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
          statusText = text + tab.title + " " + url;
          textarea.val(statusText);
          _this.status.set('text', statusText);
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
    var draft = localStorage.getItem('buffer_app_draft');
    this.status.set('text', draft);
    $("form textarea").val(draft);
    return this;
  }
});
