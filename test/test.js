var test = require('tap').test;

var Series = require('../index.js');
var liquify = require('lib-stream-liquify')
var solidify = require('lib-stream-solidify')

var x = {
  a: 'a',
  b: 'b',
}

test("add a single readable", function (t) {
  t.plan(1);

  var ss = Series();
  ss.addReadable(liquify(x))
  ss.done()
  solidify(ss).text(function (e, text) {
    var o = JSON.stringify(x);
    t.equal(text, o)
  });
})

test("add two readables", function (t) {
  t.plan(1);

  var ss = Series();
  ss.addReadable(liquify(x))
  ss.addReadable(liquify(x))
  ss.done()
  solidify(ss).text(function (e, text) {
    var o = JSON.stringify(x);
    t.equal(text, o + o)
  });
})

test("add two readables after pipe", function (t) {
  t.plan(1);

  var ss = Series();
  solidify(ss).text(function (e, text) {
    var o = JSON.stringify(x);
    t.equal(text, o + o)
  });
  ss.addReadable(liquify(x))
  ss.addReadable(liquify(x))
  ss.done()
})

test("add readable asynchronously", function (t) {
  t.plan(1);

  var ss = Series();
  solidify(ss).text(function (e, text) {
    var o = JSON.stringify(x);
    t.equal(text, o)
  });

  setImmediate(function(){
    ss.addReadable(liquify(x))
    ss.done()
  })
})

test("add pipe asynchronously", function (t) {
  t.plan(1);

  var ss = Series();

  setImmediate(function(){
    solidify(ss).text(function (e, text) {
      var o = JSON.stringify(x);
      t.equal(text, o)
    });
  })

  ss.addReadable(liquify(x))
  ss.done()
})
