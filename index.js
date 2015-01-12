var DEFAULTS = {configurable: true, enumerable: true, writable: true}

exports.defineLazyProperty = function(obj, key, fn, opts) {
  return Object.defineProperty(obj, key, describe(key, fn, opts))
}

exports.defineLazyProperties = function(obj, props, opts) {
  var descs = {}
  for (var key in props) descs[key] = describe(key, props[key], opts)
  return Object.defineProperties(obj, descs)
}

function describe(key, fn, opts) {
  if (opts == null) opts = DEFAULTS

  function get() {
    var value = fn.call(this)

    Object.defineProperty(this, key, {
      value: value,
      configurable: opts.configurable,
      enumerable: opts.enumerable,
      writable: opts.writable
    })

    return value
  }

  function set(value) {
    // Regular setter should behave like a plain property assignment.
    Object.defineProperty(this, key, {
      value: value,
      configurable: true,
      enumerable: true,
      writable: true
    })
  }

  return {
    get: get,
    set: opts.writable && set,
    configurable: true,
    enumerable: opts.enumerable
  }
}
