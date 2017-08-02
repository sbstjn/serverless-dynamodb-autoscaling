import * as names from './names'

export default class Target {
  private dependencies: string[] = []
  private type: string = 'AWS::ApplicationAutoScaling::ScalableTarget'

  constructor (
    private service: string,
    private table: string,
    private min: number,
    private max: number,
    private read: boolean,
    private index?: string,
    private stage?: string
  ) { }

  public setDependencies(list: string[]): Target {
    this.dependencies = list

    return this
  }

  public toJSON(): any {
    const resource = [ 'table/', { Ref: this.table } ]

    if (this.index) {
      resource.push('/index/', this.index)
    }

    const nameTarget = names.target(this.service, this.table, this.read, this.index, this.stage)
    const nameRole = names.role(this.service, this.table, this.index, this.stage)
    const nameDimension = names.dimension(this.read, !!this.index)

    const dependencies = [ this.table, nameRole ].concat(this.dependencies)

    return {
      [nameTarget]: {
        DependsOn: dependencies,
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
