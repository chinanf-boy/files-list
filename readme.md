# files-list [![Build Status](https://travis-ci.org/chinanf-boy/files-list.svg?branch=master)](https://travis-ci.org/chinanf-boy/files-list)

「 get path dir/+child all file path 」

## Install

```
npm install files-list
```

```
yarn add files-list
```

## Usage

```js
const filesList = require('files-list');

(async () => {
    let results = await filesList('./test.js')
//  ['.editorconfig',
//   '.gitattributes',
//   '.gitignore',
//   '.npmrc',
//   '.travis.yml',
//   '.yo-rc.json',
//   'files-list.js',
//   'license',
//   'package.json',
//   'readme.md',
//   'test.js',
//   'yarn.lock' ]
});)
```

> `filesList.sync()` is sync

## API

### filesList(path, [options])

#### path

| name: | path          |
| ----- | ------------- |
| Type: | `string`      |
| Desc: | path file/dir |

#### options

##### deep

| name:    | deep              |
| -------- | ----------------- |
| Type:    | `number`          | `string`{'all'} |
| Default: | `1`               |
| Desc:    | how deep you want |

### filesList.sync(path, [options])

| name: | sync                |
| ----- | ------------------- |
| Type: | `function`          |
| Desc: | same args, but sync |

### cancat

- [dirs-list](https://github.com/chinanf-boy/dirs-list) get dir path

### Use by

- [translate-mds](https://github.com/chinanf-boy/translate-mds) translate your md files

## License

MIT © [chinanf-boy](http://llever.com)
