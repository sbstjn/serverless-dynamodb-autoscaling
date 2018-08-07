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
    const resource = [ 'table/', { Ref: this.options.table } ]

    if (this.options.index !== '') {
      resource.push('/index/', this.options.index)
    }

    const nameTarget = this.name.target(this.read)
    const nameRole = this.name.role()
    const roleArn = this.options.roleArn
    const nameDimension = this.name.dimension(this.read)

    const DependsOn = [ this.options.table ].concat(this.dependencies)

    let accessRoleArn: any = { 'Fn::GetAtt': [ nameRole, 'Arn' ] }

    if (!!roleArn) {
      accessRoleArn = `'${roleArn}'`
    } else {
      DependsOn.concat(nameRole)
    }

    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.max,
          MinCapacity: this.min,
          ResourceId: { 'Fn::Join': [ '', resource ] },
          RoleARN: accessRoleArn,
          ScalableDimension: nameDimension,
          ServiceNamespace: 'dynamodb'
        },
        Type: this.type
      }
    }
  }
}
