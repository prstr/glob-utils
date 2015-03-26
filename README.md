<a name="prostore.module_glob-utils"></a>
#prostore.glob-utils
Glob utils used to read and compare file trees.

Usage:

```js
var glob = require('prostore.glob-utils');

glob('base/directory', 'glob/pattern/*', function(err, files) {
  // ...
});

var diff = glob.diff(oldFiles, newFiles);
// diff.added
// diff.removed
// diff.modified
// diff.unmodified
```

**Members**

* [prostore.glob-utils](#prostore.module_glob-utils)
  * [glob-utils.diff(src, dst)](#prostore.module_glob-utils.diff)
  * [glob-utils~findAndRemove(arr, fn, thisArg)](#prostore.module_glob-utils..findAndRemove)
  * [callback: glob-utils~lookupCb](#prostore.module_glob-utils..lookupCb)
  * [type: glob-utils~GlobFile](#prostore.module_glob-utils..GlobFile)

<a name="prostore.module_glob-utils.diff"></a>
##glob-utils.diff(src, dst)
Compares two lists of file descriptors yielding four arrays:

  * `added` — files existing in `src` but missing in `dst`;
  * `removed` — files existing in `dst` but missing in `src`;
  * `modified` — files existing in both `src` and `dst` but with different `md5`
  * `unmodified` — files with equal content in both `src` and `dst`

**Params**

- src `Array.<GlobFile>`  
- dst `Array.<GlobFile>`  

**Returns**: `Object`  
<a name="prostore.module_glob-utils..findAndRemove"></a>
##glob-utils~findAndRemove(arr, fn, thisArg)
Search an array by applying predicate function to each element.
If found, the element is removed from original array.

**Params**

- arr `Array` - array to search in  
- fn `function` - predicate function  
- thisArg `*` - optional value for `this` in predicate function  

**Scope**: inner function of [glob-utils](#prostore.module_glob-utils)  
**Returns**: `*` - element found or `null`  
<a name="prostore.module_glob-utils..lookupCb"></a>
##callback: glob-utils~lookupCb
**Params**

- err `*` - error object  
- files `Array.<GlobFile>` - array of file descriptors  

**Scope**: inner typedef of [glob-utils](#prostore.module_glob-utils)  
**Type**: `function`  
<a name="prostore.module_glob-utils..GlobFile"></a>
##type: glob-utils~GlobFile
File descriptor object.

Example:

```
{
  path: 'path/to/file/relative/to/cwd`,
  mtime: 1234567890,
  md5: 'd41d8cd98f00b204e9800998ecf8427e'
}
```

**Properties**

- path `string` - - path relative to `cwd`  
- mtime `number` - - last modification timestamp  
- md5 `string` - - md5 hash of file content  

**Scope**: inner typedef of [glob-utils](#prostore.module_glob-utils)  
**Type**: `object`  
