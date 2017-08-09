import { default as Name, Options } from './name'

export default class Target {
  private dependencies: string[] = []
  private type = 'AWS::ApplicationAutoScaling::ScalableTarget'

  constructor (
    private options: Options,
    private read: boolean,
    private min: number,
    private max: number
  ) { }

  public setDependencies(list: string[]): Target {
    this.dependencies = list

    return this
  }

  public toJSON(): any {
    const n = new Name(this.options)

    const resource = [ 'table/', { Ref: this.options.table } ]

    if (this.options.index) {
      resource.push('/index/', this.options.index)
    }

    const nameTarget = n.target(this.read)
    const nameRole = n.role()
    const nameDimension = n.dimension(this.read)

    const DependsOn = [ this.options.table, nameRole ].concat(this.dependencies)

    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.max,
          MinCapacity: this.min,
          ResourceId: { 'Fn::Join': [ '', resource ] },
          RoleARN: { 'Fn::GetAtt': [ nameRole, 'Arn' ] },
          ScalableDimension: nameDimension,
          ServiceNamespace: 'dynamodb'
        },
        Type: this.type
      }
    }
  }
}
