LazyObject.js
=============
[![NPM version][npm-badge]](http://badge.fury.io/js/lazy-object)
[npm-badge]: https://badge.fury.io/js/lazy-object.png

LazyObject.js lets you define properties on an object whose values are
initialized only when first accessed. From then on, values are cached/memoized.

Its `defineLazyProperty` function follows the `Object.defineProperty` signature
closely and allows you to change whether the defined properties are
`configurable`, `enumerable` and `writable`.


Installing
----------
```sh
npm install lazy-object
```

LazyObject.js follows [semantic versioning](http://semver.org/), so feel free to
depend on its major version with something like `>= 1.0.0 < 2` (a.k.a `^1.0.0`).


Using
-----
### Defining a lazily initialized property
```javascript
var LazyObject = require("lazy-object")
var Net = require("net")
var server = {}

LazyObject.defineLazyProperty(server, "connection", function() {
  return Net.connect(23, "example.com")
})
```

Properties are by default defined as `configurable`, `enumerable` and
`writable`. To change that, pass an options object as the last argument.
Then, like `Object.defineProperty`, all unset properties are set to `false`.

```javascript
LazyObject.defineLazyProperty(server, "connection", function() {
  return Net.connect(23, "example.com")
}, {configurable: true})
```

The above creates a `configurable`, but `non-enumerable` and `non-writable`
property (both before initialization and after). This prevents anyone from
overwriting the property once initalized.

### Defining multiple lazy properties
```javascript
var LazyObject = require("lazy-object")
var Pg = require("pg")
var Redis = require("redis")
var connections = {}

LazyObject.defineLazyProperties(connections, {
  pg: Pg.connect.bind(Pg, "postgres://example.com/database"),
  redis: Redis.createClient.bind(Redis)
})
```

You can change the properties' enumerability by passing in an options object as
the last argument:

```javascript
LazyObject.defineLazyProperties(connections, {
  pg: Pg.connect.bind(Pg, "postgres://example.com/database"),
  redis: Redis.createClient.bind(Redis)
}, {configurable: true, writable: true})
```

The above creates the `pg` and `redis` properties as `configurable` and `writable`, but not `enumerable`.

### Defining lazy properties on the prototype
You don't have to define properties directly on the object you want them on.
Taking advantage of prototypical inheritance, you can do so only once on the
prototype:

```javascript
var LazyObject = require("lazy-object")
var Net = require("net")

function Telnet(host, port) {
  if (host != null) this.host = host
  if (port != null) this.port = port
}

Telnet.prototype.host = null
Telnet.prototype.port = 23

LazyObject.defineLazyProperty(Telnet.prototype, "connection", function() {
  return Net.connect(this.port, this.host)
})
```

Then, only when you first access the `connection` property on a new `Telnet`
instance, will the connection be created. Different `Telnet` instances get their
own connections.


License
-------
LazyObject.js is released under a *Lesser GNU Affero General Public
License*, which in summary means:

- You **can** use this program for **no cost**.
- You **can** use this program for **both personal and commercial reasons**.
- You **do not have to share your own program's code** which uses this program.
- You **have to share modifications** (e.g. bug-fixes) you've made to this
  program.

For more convoluted language, see the `LICENSE` file.


About
-----
**[Andri Möll][moll]** typed this and the code.  
[Monday Calendar][monday] supported the engineering work.

If you find LazyObject.js needs improving, please don't hesitate to type to me
now at [andri@dot.ee][email] or [create an issue online][issues].

[email]: mailto:andri@dot.ee
[issues]: https://github.com/moll/js-lazy-object/issues
[moll]: http://themoll.com
[monday]: https://mondayapp.com
