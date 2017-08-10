import { default as Name, Options } from './name'
import Resource from './resource'

export default class Target extends Resource {
  private readonly type = 'AWS::ApplicationAutoScaling::ScalableTarget'

  constructor (
    options: Options,
    private read: boolean,
    private min: number,
    private max: number
  ) { super(options) }

  public toJSON(): any {
    const n = new Name(this.options)

    const resource = [ 'table/', { Ref: this.options.table } ]

    if (this.options.index !== '') {
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
