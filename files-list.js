const fs = require('mz/fs');
const path = require('path');

// 0 check deep level
// 1-1. if file, get absname, just one file
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

const mergeOpts = opts => {
  let n = Object.assign(JSON.parse(JSON.stringify(defaultOpts)), opts);
  return n;
};

const stopRun = opts => {
  if (opts.deep === 'all') {
    return false;
  }
  return +opts.deep < opts._currentDeep;
};

const upDeep = opts => {
  let n = Object.assign({}, opts);
  n._currentDeep++;
  return n;
};
/**
 * @description get path dir ,how deep childs dir, return all files
 * @param {pathString} contentDir
 * @param {Object} opts
 * @param {number|String} opts.deep {default 1 |'all'} how deep dir file what you want
 */
exports = module.exports = async function filesList(pathDir, opts) {
  opts = mergeOpts(opts);
  let hadPath = {}; // break Infinite loop

  async function symbolReal(p) {
    let real = await fs.realpath(p);
    let t = await fs.lstat(real);
    return { t, real };
  }

  async function selfAndChild(path, options) {
    let { step, opts, output } = options;
    let input;
    if (!hadPath[path]) {
      // self

      let action = 0;
      let type = await fs.lstat(path);
      if (type.isFile()) {
        // file
        // 1-1
        action = 2;
      } else if (type.isDirectory()) {
        // dir
        action = 1;
      } else if (type.isSymbolicLink) {
        // link
        let { t, real } = await symbolReal(path);
        if (t.isDirectory()) {
          // link dir
          path = real;
          action = 1;
        } else {
          // link file
          action = 2;
        }
      }

      if (action === 1) {
        if (step === 'self') {
          input = (await fs.readdir(path, 'utf8').then(files => files)) || [];
          hadPath[path] = true; // had check self
        } else {
          await run(path, upDeep(opts), output); // children dir
        }
      } else if (action) {
        output.push(path);
        hadPath[path] = true; // had add self path
      }

      return input;
    }
  }

  async function run(pathDir, opts, output = []) {
    if (stopRun(opts)) {
      // 0
      return Promise.resolve(output);
    }
    let absPath = path.resolve(pathDir);
    let input =
      (await selfAndChild(absPath, { step: 'self', opts, output })) || [];

    while (input.length) {
      //  children
      let path_string = input.shift();
      let absPath = path.join(pathDir, path_string); // 2
      await selfAndChild(absPath, { opts, output });
    }
    return Promise.resolve(output); // 4-2
  }

  return await run(pathDir, opts);
};
