## 1.0.1 (Jan 21, 2015)
- Manually overwriting an own lazy property (with `obj.foo = 42`) will use the
  enumerability of the lazy property. Previously manually set properties were
  always enumerable, which wasn't exactly how JavaScript by default behaves.

## 1.0.0 (Jan 12, 2015)
- "Progress isn't made by early risers. It's made by lazy men trying to find
  easier ways to do something." — Robert Heinlein
