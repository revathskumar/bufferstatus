Buffer.Models.User = Backbone.Model.extend({
  defaults: function(){
    var data = localStorage.getItem('buffer_app_user');
    user = data && JSON.parse(data);
    if(user !== null){
      return user;
    }else{
      return({
        id: "",
        name: "",
        profiles: {},
        token: ""
      });
    }
  },
  save: function(options,callback){
    if(options) this.set(options);
    localStorage.setItem('buffer_app_user', JSON.stringify(this.toJSON()));
    if(callback && callback.success) callback.success(this);
  },
  getUser: function(){
    var _this = this;
    Backbone.ajax("https://api.bufferapp.com/1/user.json",{
      type: "GET",
      data: {access_token: this.get('token') },
      success: function(data, textStatus, jqXHR){
        _this.success(data);
      },
      error: function(xhr, settings, message){
        _this.error(message);
      }
    });
  },
  success: function(data, textStatus, jqXHR){
    if("error" in data){
      this.trigger('error', "Invalid Token");
      return;
    }
    console.log(this);
    this.set({name: data.name, id: data.id}, {silent: true});
    this.save();
    this.trigger('success');
  },
  error: function(message){
    this.trigger('error', message);
  },
  resetAll: function(){
    this.save({token:"", id: "", profiles: [], name:""});
    localStorage.removeItem('buffer_app_user');
  }
});
