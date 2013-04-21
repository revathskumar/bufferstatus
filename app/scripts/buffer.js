var user = new Buffer.Models.User();
var authView = new Buffer.Views.AuthView({el: $("#buffer"), model: user});
authView.getMessage();
