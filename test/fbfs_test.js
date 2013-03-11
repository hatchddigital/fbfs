/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

    module('jQuery#FBFS', {
        setup: function() {
            this.elems = $('.fbfs');
        }
    });

    test('Setup up test', function () {
        ok($.fn.fbfs, "FBFS jQuery plugin exists");
        ok(window.FBFS, "FBFS module exists");
    });

    test('Ensure settings are working', function () {
        var callback = function () { return true; }
          , fbfs = new window.FBFS(this.elems.first(), {
                'onUserSelect': callback
            });
        equal(fbfs.options.onUserSelect, callback, 'User select callback set');
    });

}(jQuery));
