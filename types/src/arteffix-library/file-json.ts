export interface IFileJson<O> {
  readonly rootDir: string
  readonly filename: string
  readonly filepath: string
  readonly defaultValue: O

  init: () => Promise<void>

  destroy: () => Promise<boolean>

  save: (json: object) => Promise<boolean>
}
