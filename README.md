# ProStore Glob Utilities

Glob utils are used to lookup and compare file trees.

## Usage

List files in `base/directory`:

```js
var glob = require('prostore.glob-utils');

glob('base/directory', 'glob/pattern/*', function(err, files) {
  // [ { path: 'rel/path/file1', mtime: 123456, md5: 'efcd...' }, ...]
});
```

Compare files:

```js
var diff = glob.diff(oldFiles, newFiles);
// diff.added
// diff.removed
// diff.modified
// diff.unmodified
```

See source docs for more info.
