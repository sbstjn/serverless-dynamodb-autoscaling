import Name from './name'

export default class Resource {
  protected dependencies: string[] = []
  protected name: Name

  constructor(protected options: Options) {
    this.name = new Name(options)
  }

  public setDependencies(list: string[]): Resource {
    this.dependencies = list

    return this
  }
}
