import { default as Name, Options } from './name'

export default class Policy {
  private dependencies: string[] = []
  private type: string = 'AWS::ApplicationAutoScaling::ScalingPolicy'

  constructor (
    private options: Options,
    private read: boolean,
    private value: number,
    private scaleIn: number,
    private scaleOut: number
  ) { }

  public setDependencies(list: string[]): Policy {
    this.dependencies = list

    return this
  }

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
