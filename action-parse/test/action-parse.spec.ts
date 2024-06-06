import * as fs from 'fs';
import * as path from 'path';
import { actionParse, renderTemplate } from '../src';

describe('actionParse', () => {
  it('install.yaml parse', () => {
    const context = fs.readFileSync(
      path.join(__dirname, '../src/data/install.yaml'),
      'utf8',
    );
    console.log(JSON.stringify(actionParse(context)));
  });

  it('environment.yaml parse', () => {
    const context = fs.readFileSync(
      path.join(__dirname, '../src/data/environment.yaml'),
      'utf8',
    );
    const json = actionParse(context);
    console.log(renderTemplate((json.jobs['conda'].steps[0].with as any).url, {
      global: json.jobs['conda'].global,
      os: {
        platform: "darwin",
        arch: "arm64",
      }
    }));
    console.log(JSON.stringify(json, undefined, 4));
  });

  it('test.yaml parse', () => {
    const context = fs.readFileSync(
      path.join(__dirname, '../src/data/test.yaml'),
      'utf8',
    );
    console.log(JSON.stringify(actionParse(context)));
  });
});
