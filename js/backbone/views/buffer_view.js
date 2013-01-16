Buffer.Views.BufferView = Backbone.View.extend({
  initialize: function () {
    console.log("initialize BufferView");
  },
  render:function(){
    $(this.el).empty().html($('#buffer_view').html());
    return this;
  }
});
