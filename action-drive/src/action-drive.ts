import { ActionUse } from '@beaver/action-core';
import { IWthForDrive } from '@beaver/types';
import * as path from 'path';
// @ts-ignore
import * as Pdrive from 'pdrive';

export class ActionDrive extends ActionUse<IWthForDrive> {
  async run(): Promise<string> {
    const drivePath = path.resolve(this.home, 'drive');
    const drive = new Pdrive(drivePath);
    let driveMap: string[] | string;

    // 处理path路径
    for (let driveKey in this.with.ln) {
      const link = this.with.ln[driveKey];

      if (Array.isArray(link)) {
        let toContinue = false;
        for (let string of link) {
          if (path.isAbsolute(string) || string.startsWith('.')) {
            toContinue = true;
            break;
          }
        }

        if (toContinue) continue;
      } else {
        if (path.isAbsolute(link) || link.startsWith('.')) {
          continue;
        }
      }

      if (path.isAbsolute(driveKey) || driveKey.startsWith('.')) {
        break;
      }

      let linkPath: string | string[];
      if (Array.isArray(link)) {
        linkPath = link.map((ln) => {
          return path.resolve(this.home, ln);
        });
      } else {
        linkPath = path.resolve(this.home, link);
      }

      driveMap[driveKey] = linkPath;
    }

    await drive.create({
      uri: this.with.uri,
      drive: driveMap,
      peers: this.with.peers,
    });
    return '0';
  }
}
