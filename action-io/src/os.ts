import * as path from 'path';
import { IS_WINDOWS, isRooted, mkdir, tryGetExecutablePath } from './io-util';

/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
export async function mkdirP(fsPath: string): Promise<void> {
  await mkdir(fsPath, { recursive: true });
}

/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
export async function which(tool: string, check?: boolean): Promise<string> {
  if (!tool) {
    throw new Error("parameter 'tool' is required");
  }

  // recursive when check=true
  if (check) {
    const result: string = await which(tool, false);

    if (!result) {
      if (IS_WINDOWS) {
        throw new Error(
          `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`,
        );
      } else {
        throw new Error(
          `Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`,
        );
      }
    }

    return result;
  }

  const matches: string[] = await findInPath(tool);

  if (matches && matches.length > 0) {
    return matches[0];
  }

  return '';
}

/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
export async function findInPath(tool: string): Promise<string[]> {
  if (!tool) {
    throw new Error("parameter 'tool' is required");
  }

  // build the list of extensions to try
  const extensions: string[] = [];
  if (IS_WINDOWS && process.env['PATHEXT']) {
    for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
      if (extension) {
        extensions.push(extension);
      }
    }
  }

  // if it's rooted, return it if exists. otherwise return empty.
  if (isRooted(tool)) {
    const filePath: string = await tryGetExecutablePath(tool, extensions);

    if (filePath) {
      return [filePath];
    }

    return [];
  }

  // if any path separators, return empty
  if (tool.includes(path.sep)) {
    return [];
  }

  // build the list of directories
  //
  // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
  // it feels like we should not do this. Checking the current directory seems like more of a use
  // case of a shell, and the which() function exposed by the toolkit should strive for consistency
  // across platforms.
  const directories: string[] = [];

  if (process.env['PATH']) {
    for (const p of process.env['PATH'].split(path.delimiter)) {
      if (p) {
        directories.push(p);
      }
    }
  }

  // find all matches
  const matches: string[] = [];

  for (const directory of directories) {
    const filePath = await tryGetExecutablePath(
      path.join(directory, tool),
      extensions,
    );
    if (filePath) {
      matches.push(filePath);
    }
  }

  return matches;
}
