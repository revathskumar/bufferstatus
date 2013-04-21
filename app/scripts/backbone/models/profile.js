Buffer.Models.Profile = Backbone.Model.extend({
  initialize: function (options) {
    if(options && options.user)  this.user = options.user;
  },
  get: function () {
    var data = localStorage.getItem('buffer_app_user');
    return data && JSON.parse(data).profiles;
  },
  getProfiles: function () {
    var _this = this;
    Backbone.ajax("https://api.bufferapp.com/1/profiles.json",{
      type: "GET",
      data: {access_token: this.user.get('token') },
      success: function(data, textStatus, jqXHR){
        _this.profileSuccess(data);
      },
      error: function(xhr, settings, message){
        _this.profileError(message);
      }
    });
  },
  profileSuccess: function (data, textStatus, jqXHR) {
    var profiles = [];
    _.each(data, function(element, index, list){
      profiles.push({id: element.id, default: element.default, service: element.formatted_service});
    });
    this.user.save({profiles: profiles});
    this.user.trigger('success');
  },
  profileError: function (message) {
    this.user.trigger('error', message);
  }
});
