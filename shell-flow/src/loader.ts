import { parse } from 'csv-parse';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as vm from 'vm';
import * as yaml from 'yaml';

export async function loader(filePath: string) {
  const extension = path.extname(filePath);

  let resolved;
  let dirname = path.dirname(filePath);

  switch (extension) {
    case '.json':
      resolved = fs.readJsonSync(filePath);
      break;
    case '.js':
      resolved = await requireJS(filePath);
      break;
    default:
      const status = await fs.promises.stat(filePath);
      if (status.isDirectory()) {
        resolved = await requireJS(filePath);
        dirname = filePath;
      } else {
        resolved = null;
      }
  }

  return {
    resolved,
    extension,
    dirname,
  };
}

export async function requireJS(filePath: string) {
  if (filePath === 'path') {
    return path;
  }

  const code = fs.readFileSync(filePath, 'utf8');
  const dirname = path.dirname(filePath);

  // 创建一个模块沙箱环境
  const sandbox = {
    console: console,
    exports: {},
    require: requireJS, // 允许模块内部使用自定义的require函数
    module: {
      exports: {},
    },
    __filename: filePath,
    __dirname: dirname,
  };
  sandbox.module.exports = sandbox.exports;

  // 使用vm模块执行代码
  vm.runInNewContext(code, sandbox, { filename: filePath });

  return sandbox.module.exports;
}

export async function requireImage(filePath: string) {
  const buffer = await fs.promises.readFile(filePath);
  return buffer.toString('base64');
}

export async function requireYAML(filePath: string) {
  const str = await fs.promises.readFile(filePath, 'utf8');
  return yaml.parse(str);
}

export async function requireCSV(filePath: string) {
  const str = await fs.promises.readFile(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    parse(
      str,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      },
    );
  });
}
