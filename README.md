#Index

**Modules**

* [prostore.glob-utils](#prostore.module_glob-utils)
  * [glob-utils.diff(src, dst)](#prostore.module_glob-utils.diff)

**Typedefs**

* [type: GlobFile](#GlobFile)
 
<a name="prostore.module_glob-utils"></a>
#prostore.glob-utils
Lookup files in `cwd` directory matching glob `pattern`.

Usage:

```js
var glob = require('prostore.glob-utils');

glob('base/directory', 'glob/pattern/*', function(err, files) {
  // ...
});
```

Dot-files (i.e. starting with dot) are not returned as per `glob` module.
Directories are not returned either.

**Params**

- cwd `string` - (current work directory) a directory where lookup is
  performed; this path is also stripped from resulting file paths.  
- pattern `string` - glob pattern  
- cb `function` - callback `function(err, files)`,
  where `files` is an array of [GlobFile](#GlobFile)  

<a name="prostore.module_glob-utils.diff"></a>
##glob-utils.diff(src, dst)
Compares two lists of file descriptors yielding four arrays:

  * `added` — files existing in `src` but missing in `dst`
  * `removed` — files existing in `dst` but missing in `src`
  * `modified` — files existing in both `src` and `dst` but with different `md5`
  * `unmodified` — files with equal content in both `src` and `dst`

Usage:

```
var diff = glob.diff(oldFiles, newFiles);
// diff.added
// diff.removed
// diff.modified
// diff.unmodified
```

**Params**

- src <code>[Array.&lt;GlobFile&gt;](#GlobFile)</code>  
- dst <code>[Array.&lt;GlobFile&gt;](#GlobFile)</code>  

<a name="GlobFile"></a>
#type: GlobFile
File descriptor object.

Example:

```js
{
  path: 'path/to/file/relative/to/cwd',
  mtime: 1234567890,
  md5: 'd41d8cd98f00b204e9800998ecf8427e'
}
```

**Properties**

- path `string` - path relative to `cwd`  
- mtime `number` - last modification timestamp  
- md5 `string` - md5 hash of file content  

**Type**: `object`  
