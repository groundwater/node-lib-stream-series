var test = require('tap').test;

var Series = require('../index.js');
var liquify = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

var x = {
  a: 'a',
  b: 'b',
}

test("triple stream", function (t) {
  t.plan(1);

  var s0 = Series();
  var s1 = Series();
  var s2 = Series();

  s2.addReadable(s1);
  s2.done();

  s1.addReadable(s0)
  s1.done()

  s0.addReadable(liquify({asdf: 'asdf'}))
  s0.done()

  solidify(s2).json(function (e, x) {
    t.deepEquals(x, {asdf: 'asdf'})
    t.end();
  })
})

test("triple stream", function (t) {
  t.plan(1);

  var s0 = Series();
  var s1 = Series();
  var s2 = Series();

  s2.addReadable(s1);
  s1.addReadable(s0)
  s0.addReadable(liquify({asdf: 'asdf'}))

  s2.on('data', function (data) {
    t.equals(data.toString(), '{"asdf":"asdf"}')
    t.end()
  })
})
