const fs = require('mz/fs');
const path = require('path');

// 0 check deep level
// 1-1. if file, get dirname
// 1-2. if dir, get dir/files array
// 2. abs path
// 3. if dir, search next dir
// 4-1. output is ref value, so
// 4-2. deep push , can collage all values

// options
const defaultOpts = {
  deep: 1,
  _currentDeep: 1,
};

const mergeOpts = opts =>
  Object.assign(JSON.parse(JSON.stringify(defaultOpts)), opts);

const stopRun = opts => {
  if (opts.deep === 'all') {
    return false;
  }
  return +opts.deep < opts._currentDeep;
};
/**
 * @description get path dir ,how deep childs dir, return all files
 * @param {pathString} contentDir
 * @param {Object} opts
 * @param {number|String} opts.deep {default 1 |'all'} how deep dir file what you want
 */
exports = module.exports = async function filesList(pathDir, opts) {
  opts = mergeOpts(opts);

  async function run(pathDir, opts, output = []) {
    let first = opts._currentDeep === 1 ? true : false;
    if (stopRun(opts)) {
      // 0
      return Promise.resolve(output);
    }
    let input = [];

    if (await fs.lstat(pathDir).then(x => x.isFile())) {
      // 1-1
      pathDir = path.dirname(pathDir);
      input = await fs.readdir(pathDir, 'utf8').then(files => files); // 1-2
    } else {
      input = await fs.readdir(pathDir, 'utf8').then(files => files); // 1-2
    }

    while (input.length) {
      let path_string = input.shift();
      let absPath = path.join(pathDir, path_string); // 2

      if (await fs.lstat(absPath).then(x => x.isDirectory())) {
        // 3
        opts._currentDeep++;
        await run(absPath, opts, output);
      } else {
        // 4-1
        output.push(absPath);
      }
    }
    return output; // 4-2
  }

  return await run(pathDir, opts);
};

function sync(pathDir, opts) {
  opts = mergeOpts(opts);

  function run(pathDir, opts, output = []) {
    if (stopRun(opts)) {
      // 0
      return;
    }
    let input = [];

    if (fs.lstatSync(pathDir).isFile()) {
      // 1-1
      pathDir = path.dirname(pathDir);
      input = fs.readdirSync(pathDir, 'utf8'); // 1-2
    } else {
      input = fs.readdirSync(pathDir, 'utf8'); // 1-2
    }

    while (input.length) {
      let path_string = input.shift();
      let absPath = path.join(pathDir, path_string); // 2

      if (fs.lstatSync(absPath).isDirectory()) {
        // 3
        opts._currentDeep++;
        run(absPath, opts, output);
      } else {
        output.push(absPath); // 4-1
      }
    }

    return output; // 4-2
  }

  return run(pathDir, opts);
}

exports.sync = sync;
