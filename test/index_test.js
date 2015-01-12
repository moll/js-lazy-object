var Sinon = require("sinon")
var LazyObject = require("..")
var defineLazyProperty = LazyObject.defineLazyProperty
var defineLazyProperties = LazyObject.defineLazyProperties

describe("LazyObject", function() {
  describe(".defineLazyProperty", function() {
    it("must return object", function() {
      var obj = {}
      defineLazyProperty(obj, "abc", noop).must.equal(obj)
    })

    it("must call function once", function() {
      var obj = {}, spy = Sinon.spy()
      defineLazyProperty(obj, "abc", spy)

      obj.abc
      obj.abc
      spy.callCount.must.equal(1)
      spy.firstCall.thisValue.must.equal(obj)
    })

    it("must call function once for every inherited object", function() {
      var spy = Sinon.spy()
      var prototype = defineLazyProperty({}, "abc", spy)

      var a = Object.create(prototype)
      a.abc
      a.abc

      var b = Object.create(prototype)
      b.abc
      b.abc

      spy.callCount.must.equal(2)
      spy.thisValues[0].must.equal(a)
      spy.thisValues[1].must.equal(b)
    })

    it("must set property to return value of function", function() {
      var obj = defineLazyProperty({}, "abc", function() { return 42 })
      obj.abc.must.equal(42)
      obj.abc.must.equal(42)
    })

    it("must set property for inherited objects", function() {
      var i = 0
      var obj = defineLazyProperty({}, "abc", function() { return ++i })

      var a = Object.create(obj)
      a.abc.must.equal(1)
      a.abc.must.equal(1)

      var b = Object.create(obj)
      b.abc.must.equal(2)
      b.abc.must.equal(2)
    })

    it("must define getter enumerable", function() {
      var obj = defineLazyProperty({}, "abc", noop)
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.true()
    })

    it("must define getter non-enumerable if asked", function() {
      var obj = defineLazyProperty({}, "abc", noop, {})
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.false()
    })

    it("must define set property with defaults", function() {
      var obj = defineLazyProperty({}, "abc", noop)
      obj.abc
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.true()
    })

    it("must define set property with given description", function() {
      var obj = defineLazyProperty({}, "abc", noop, {
        configurable: true, enumerable: true, writable: true
      })
      obj.abc

      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.true()
    })

    it("must define set property with given empty description", function() {
      var obj = defineLazyProperty({}, "abc", noop, {})
      obj.abc
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.false()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.false()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.false()
    })

    it("must define set property as regular when inherited", function() {
      var prototype = defineLazyProperty({}, "abc", noop)
      var obj = Object.create(prototype)
      obj.abc
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.true()
    })

    it("must be writable", function() {
      var obj = {}
      defineLazyProperty(obj, "abc", noop).abc = 42

      obj.abc.must.equal(42)
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.true()
    })

    it("must not be writable if set so", function() {
      var obj = {}
      defineLazyProperty(obj, "abc", function() { return 42 }, {}).abc = 69

      obj.abc.must.equal(42)
      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.false()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.false()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.false()
    })
  })

  describe(".defineLazyProperties", function() {
    it("must return object", function() {
      var obj = {}
      defineLazyProperties(obj, {abc: noop}).must.equal(obj)
    })

    it("must define lazy properties", function() {
      var obj = {}
      var a = Sinon.spy(function() { return 42 })
      var b = Sinon.spy(function() { return 69 })
      defineLazyProperties(obj, {a: a, b: b})

      obj.a.must.equal(42)
      obj.a.must.equal(42)
      obj.b.must.equal(69)
      obj.b.must.equal(69)

      a.callCount.must.equal(1)
      b.callCount.must.equal(1)
    })

    it("must set properties with given description", function() {
      var obj = defineLazyProperties({}, {abc: noop}, {
        configurable: true, writable: true
      })
      obj.abc

      Object.getOwnPropertyDescriptor(obj, "abc").configurable.must.be.true()
      Object.getOwnPropertyDescriptor(obj, "abc").enumerable.must.be.false()
      Object.getOwnPropertyDescriptor(obj, "abc").writable.must.be.true()
    })
  })
})

function noop() {}
