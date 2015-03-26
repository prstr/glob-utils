#Index

**Modules**

* [1519657501temp-file](#module_1519657501temp-file)
  * [1519657501temp-file.diff(src, dst)](#module_1519657501temp-file.diff)
  * [1519657501temp-file~findAndRemove(arr, fn, thisArg)](#module_1519657501temp-file..findAndRemove)

**Typedefs**

* [type: globFile](#globFile)
 
<a name="module_1519657501temp-file"></a>
#1519657501temp-file
Expands glob `pattern` into an array of file descriptors.

Dot-files (i.e. starting with dot) are not returned as per `glob` module.

**Params**

- cwd `string` - (current work directory) a directory where lookup is
  performed; this path is also stripped from resulting file paths.  
- pattern `string` - glob pattern  
- cb `function` - callback  

**Members**

* [1519657501temp-file](#module_1519657501temp-file)
  * [1519657501temp-file.diff(src, dst)](#module_1519657501temp-file.diff)
  * [1519657501temp-file~findAndRemove(arr, fn, thisArg)](#module_1519657501temp-file..findAndRemove)

<a name="module_1519657501temp-file.diff"></a>
##1519657501temp-file.diff(src, dst)
Compares two lists of file descriptors yielding four arrays:

  * `added` — files existing in `src` but missing in `dst`;
  * `removed` — files existing in `dst` but missing in `src`;
  * `modified` — files existing in both `src` and `dst` but with different `md5`
  * `unmodified` — files with equal content in both `src` and `dst`

**Params**

- src <code>[Array.&lt;globFile&gt;](#globFile)</code>  
- dst <code>[Array.&lt;globFile&gt;](#globFile)</code>  

**Returns**: `Object`  
<a name="module_1519657501temp-file..findAndRemove"></a>
##1519657501temp-file~findAndRemove(arr, fn, thisArg)
Search an array by applying predicate function to each element.
If found, the element is removed from original array.

**Params**

- arr `Array` - array to search in  
- fn `function` - predicate function  
- thisArg  - optional value for `this` in predicate function  

**Scope**: inner function of [1519657501temp-file](#module_1519657501temp-file)  
**Returns**: `*` - element found or `null`  
<a name="globFile"></a>
#type: globFile
Each file descriptor looks like this:

```
{
  path: 'path/to/file/relative/to/cwd`,
  mtime: 1234567890,
  md5: 'd41d8cd98f00b204e9800998ecf8427e'
}
```

**Type**: `Object`  
