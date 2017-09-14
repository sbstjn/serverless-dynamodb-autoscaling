import Resource from './resource'

export default class Target extends Resource {
  private readonly type = 'AWS::ApplicationAutoScaling::ScalableTarget'

  constructor(
    options: Options,
    private read: boolean,
    private min: number,
    private max: number
  ) { super(options) }

  public toJSON(): any {

    const nameTarget = this.name.target(this.read)
    const nameRole = this.name.role()
    const nameDimension = this.name.dimension(this.read)
    let DependsOn;
    let resource;
    if (this.options.table && this.options.table['name'] && typeof this.options.table['name'] === 'string') {
      resource = `table/${this.options.table['name']}`;
      if (this.options.index !== '' || this.options.index.length > 0) {
        resource += `/index/${this.options.index}`
      }
      DependsOn = [nameRole].concat(this.dependencies)
    } else {
      resource = ['table/', { Ref: this.options.table }]
      if (this.options.index !== '') {
        resource.push('/index/', this.options.index)
      }
      DependsOn = [this.options.table, nameRole].concat(this.dependencies)
      resource = { 'Fn::Join': ['', resource] };
    }
    return {
      [nameTarget]: {
        DependsOn,
        Properties: {
          MaxCapacity: this.max,
          MinCapacity: this.min,
          ResourceId: resource,
          RoleARN: { 'Fn::GetAtt': [nameRole, 'Arn'] },
          ScalableDimension: nameDimension,
          ServiceNamespace: 'dynamodb'
        },
        Type: this.type
      }
    }
  }
}
