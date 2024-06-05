import { ExecOptions } from '@beaver/types';
import { argStringToArray, Runner } from './runner';

/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
export async function exec(
  commandLine: string,
  args?: string[],
  options?: ExecOptions,
): Promise<number> {
  const commandArgs = argStringToArray(commandLine);
  if (commandArgs.length === 0) {
    throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
  }
  // Path to tool to execute should be first arg
  const toolPath = commandArgs[0];
  args = commandArgs.slice(1).concat(args || []);
  const runner: Runner = new Runner(toolPath, args, options);
  return runner.exec();
}
