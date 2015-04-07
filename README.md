# Glob Utils

Утилиты для работы со списками файлов по [glob](http://en.wikipedia.org/wiki/Glob_%28programming%29)-шаблонам.

Основные задачи:

  1. получение списка файлов в заданной директории фильтрацией по содержимому
     `.gitignore` (если есть)
  2. сравнение двух списков файлов (что добавлено, что удалено, что изменено)
  3. копирование списка файлов в указанную директорию

## Файловые дескрипторы

Все методы оперируют файловыми дескрипторами в следующем формате: 

```js
{
  path: 'path/to/file/relative/to/cwd',
  mtime: 1234567890,
  md5: 'd41d8cd98f00b204e9800998ecf8427e'
}
```

Пути к файлам возвращаются относительно рабочей директории (параметр `cwd`).
 
## Использование

```js
var glob = require('prostore.glob-utils');
```
    

1. Поиск файлов в `base/directory`:

    ```js
    glob('base/directory', '**/*', function(err, files) { 
      // [ { path: 'rel/path/to/file1', mtime: 1234567890, md5: 'd41d8cd...' }, ... ] 
    });
    ```

2. Сравнение списков файлов:

    ```js
    var diff = glob.diff(newFiles, oldFiles);
    // diff.added — файлы, которые есть в `newFiles`, но отсутствуют в `oldFiles` 
    // diff.removed — файлы, которые есть в `oldFiles`, но отсутствуют в `newFiles`
    // diff.modified — файлы, хэши которых не совпадают
    // diff.unmodified — одинаковые файлы
    ```
    
3. Копирование:

    ```js
    glob.copy('path/to/src', '**/*', 'path/to/dst', function(err) { ... })
    ```
