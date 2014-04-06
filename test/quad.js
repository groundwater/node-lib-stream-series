var test = require('tap').test;

var Series = require('../index.js');
var liquify = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

var x = {
  a: 'a',
  b: 'b',
}

test("test a bunch of streams together", function (t) {
  var s0 = Series();

  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))

  solidify(s0).text(function (e, txt) {
    var s = JSON.stringify(x)
    t.equal(txt, s+s+s+s+s+s+s+s)
    t.end()
  })

  s0.done()
})

test("test a bunch of streams together with on data events", function (t) {
  t.plan(8);

  var s0 = Series();

  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))
  s0.addReadable(liquify(x))

  var s = JSON.stringify(x);
  s0.on('data', function (data) {
    t.equal(data.toString(), s);
  })
})
