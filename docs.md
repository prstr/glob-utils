<a name="module_index"></a>
#index
Glob utils are used to read and compare file trees.

Usage:

```js
var glob = require('prostore.glob-utils');

glob('base/directory', 'glob/pattern/*', function(err, files) {
  // ...
});
```

**Members**

* [index](#module_index)
  * [module.exports ⏏](#exp_module_index)
    * [index.diff(src, dst)](#module_index.diff)
    * [index~findAndRemove(arr, fn, thisArg)](#module_index..findAndRemove)
    * [callback: index~lookupCb](#module_index..lookupCb)
    * [type: index~GlobFile](#module_index..GlobFile)

<a name="module_index.diff"></a>
##index.diff(src, dst)
Compares two lists of file descriptors yielding four arrays:

  * `added` — files existing in `src` but missing in `dst`;
  * `removed` — files existing in `dst` but missing in `src`;
  * `modified` — files existing in both `src` and `dst` but with different `md5`
  * `unmodified` — files with equal content in both `src` and `dst`

**Params**

- src `Array.<GlobFile>`  
- dst `Array.<GlobFile>`  

**Returns**: `Object`  
<a name="module_index..findAndRemove"></a>
##index~findAndRemove(arr, fn, thisArg)
Search an array by applying predicate function to each element.
If found, the element is removed from original array.

**Params**

- arr `Array` - array to search in  
- fn `function` - predicate function  
- thisArg `*` - optional value for `this` in predicate function  

**Scope**: inner function of [index](#module_index)  
**Returns**: `*` - element found or `null`  
<a name="module_index..lookupCb"></a>
##callback: index~lookupCb
**Params**

- err `*` - error object  
- files `Array.<GlobFile>` - array of file descriptors  

**Scope**: inner typedef of [index](#module_index)  
**Type**: `function`  
<a name="module_index..GlobFile"></a>
##type: index~GlobFile
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

**Scope**: inner typedef of [index](#module_index)  
**Type**: `object`  
