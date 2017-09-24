import Resource from './resource'

export default class Policy extends Resource {
  private readonly type: string = 'AWS::ApplicationAutoScaling::ScalingPolicy'

  constructor (
    options: Options,
    private read: boolean,
    private value: number,
    private scaleIn: number,
    private scaleOut: number
  ) { super(options) }

  public toJSON(): any {
    const PredefinedMetricType = this.name.metric(this.read)
    const PolicyName = this.name.policyScale(this.read)
    const Target = this.name.target(this.read)
    let DependsOn;
    if(this.options.table && this.options.table['name'] && typeof this.options.table['name'] === 'string'){
      DependsOn = [ Target ].concat(this.dependencies)
    }
    else{
     DependsOn = [ this.options.table, Target ].concat(this.dependencies)
    }

    return {
      [PolicyName]: {
        DependsOn,
        Properties: {
          PolicyName,
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: Target },
          TargetTrackingScalingPolicyConfiguration: {
            PredefinedMetricSpecification: {
              PredefinedMetricType
            },
            ScaleInCooldown: this.scaleIn,
            ScaleOutCooldown: this.scaleOut,
            TargetValue: this.value
          }
        },
        Type: this.type
      }
    }
  }
}
