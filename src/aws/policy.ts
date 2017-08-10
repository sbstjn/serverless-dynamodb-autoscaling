import { default as Name, Options } from './name'
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
    const n = new Name(this.options)

    const PredefinedMetricType = n.metric(this.read)
    const PolicyName = n.policyScale(this.read)
    const Target = n.target(this.read)

    const DependsOn = [ this.options.table, Target ].concat(this.dependencies)

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
