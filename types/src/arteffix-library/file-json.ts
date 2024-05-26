export interface IFileJson<O> {
  readonly rootDir: string
  readonly filename: string
  readonly filepath: string

  read: () => Promise<O | undefined>

  destroy: () => Promise<boolean>

  save: (json: object) => Promise<boolean>
}
