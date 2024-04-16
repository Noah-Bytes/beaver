import * as process from 'process';
import { ShellFlow } from '@beaver/shell-flow';

const globalForShellFlow = globalThis as unknown as {
  shellFlow: ShellFlow | undefined;
};

export let shellFlow = globalForShellFlow.shellFlow;

export async function initShellFlow(homeDir: string) {
  if (process.env.NODE_ENV !== 'production') {
    shellFlow = globalForShellFlow.shellFlow = new ShellFlow('ArtEffix', {
      isMirror: true,
      homeDir,
    });
  } else {
    shellFlow = new ShellFlow('ArtEffix', {
      isMirror: true,
      homeDir,
    });
  }
  await shellFlow!.init();
}
