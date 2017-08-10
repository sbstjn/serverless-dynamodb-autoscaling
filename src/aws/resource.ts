import { Options } from './name'

export default class Resource {
    protected dependencies: string[] = []

    constructor(protected options: Options) { }

    public setDependencies(list: string[]): Resource {
      this.dependencies = list

      return this
    }
}
