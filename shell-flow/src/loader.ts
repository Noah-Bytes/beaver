import * as yaml from 'yaml';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as path from 'path';
import * as clearModule from 'clear-module';
import {createLogger} from "./logger";

const logger = createLogger(`loader`);

export async function loader(filePath: string, props?: any) {
  const extension = path.extname(filePath);
  clearModule(filePath);

  let resolved;
  let dirname = path.dirname(filePath);

  switch (extension) {
    case '.json':
      resolved = requireJSON(filePath);
      break;
    case '.js':
      resolved = await requireJS(filePath, props);
      break;
    default:
      const status = await fs.promises.stat(filePath);
      if (status.isDirectory()) {
        resolved = await requireJS(filePath, props);
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

export function requireJSON(filePath: string) {
  let config;
  try {
    config = require(filePath);
  } catch (e) {
    logger.error(e);
  }

  return config;
}

export function requireJS(filePath: string, props?: any) {
  let config;
  try {
    config = require(filePath);
  } catch (e) {
    logger.error(e);
  }
  try {
    // if the required module is a class, return the instantiated object
    return new config(props);
  } catch (e) {
    // otherwise return normally
    return config;
  }
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
