var url = require('../js/backbone/lib/url');
var assert = require('assert');

describe('Url', function(){
  describe("shorten", function(){
    it("return hello", function () {
      assert.equal("hello", url.shorten());
    })
  })
});
