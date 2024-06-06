import { ExecOptions } from '@beaver/types';
import { Runner } from './runner';

/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Runner runner
 */
export function exec(
  commandLine: string,
  args?: string[],
  options?: ExecOptions,
): Runner {
  return new Runner(commandLine, args, options);
}
