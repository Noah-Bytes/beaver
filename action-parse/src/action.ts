import { arch, platform } from '@beaver/system-info';

export class Action {
  private context = {
    os: {
      platform,
      arch,
    },
  };

  constructor() {
  }


}
