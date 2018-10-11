const path = require('path');
const fs = require('mz/fs');

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
  ignore: ['.git', 'node_modules'],
};

const mergeOpts = opts => {
  const n = Object.assign(JSON.parse(JSON.stringify(defaultOpts)), opts);
  return n;
};

const stopRun = opts => {
  if (opts.deep === 'all') {
    return false;
  }
  return Number(opts.deep) < opts._currentDeep;
};

const upDeep = opts => {
  const n = Object.assign({}, opts);
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
  const hadPath = {}; // Break Infinite loop

  async function symbolReal(p) {
    const real = await fs.realpath(p);
    const t = await fs.lstat(real);
    return { t, real };
  }

  async function selfAndChild(path, options) {
    const { step, opts, output } = options;
    let input;
    if (!hadPath[path]) {
      // Self

      let action = 0;
      try {
        const type = await fs.lstat(path);
        if (type.isFile()) {
          // File
          // 1-1
          action = 2;
        } else if (type.isDirectory()) {
          // Dir
          action = 1;
        } else if (type.isSymbolicLink) {
          // Link
          const { t, real } = await symbolReal(path);
          if (t.isDirectory()) {
            // Link dir
            path = real;
            action = 1;
          } else {
            // Link file
            action = 2;
          }
        }
      } catch (err) {
        return input;
      }

      if (action === 1) {
        if (step === 'self') {
          input = (await fs.readdir(path, 'utf8').then(files => files)) || [];
          input = input.filter(x => !opts.ignore.some(ig => ig === x));
          hadPath[path] = true; // Had check self
        } else {
          await run(path, upDeep(opts), output); // Children dir
        }
      } else if (action) {
        output.push(path);
        hadPath[path] = true; // Had add self path
      }

      return input;
    }
  }

  async function run(pathDir, opts, output = []) {
    if (stopRun(opts)) {
      // 0
      return Promise.resolve(output);
    }
    const absPath = path.resolve(pathDir);
    const input =
      (await selfAndChild(absPath, { step: 'self', opts, output })) || [];

    while (input.length) {
      //  Children
      const path_string = input.shift();
      const absPath = path.join(pathDir, path_string); // 2
      await selfAndChild(absPath, { opts, output });
    }
    return Promise.resolve(output); // 4-2
  }

  return await run(pathDir, opts);
};
