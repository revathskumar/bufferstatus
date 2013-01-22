var url = require('../js/backbone/lib/url');
var assert = require('assert');

describe('Url', function(){
  describe("shorten", function(){
    it("return hello", function () {
      assert.equal("hello", url.shorten('hello'));
    });

    it("return false when url is not passed", function () {
      assert.equal(false,url.shorten(""));
      assert.equal(false,url.shorten());
      assert.equal(false,url.shorten(null));
    });
  })
});
