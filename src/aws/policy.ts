import * as names from './names'

export default class Policy {
  private dependencies: string[] = []
  private type: string = 'AWS::ApplicationAutoScaling::ScalingPolicy'

  constructor (
    private service: string,
    private table: string,
    private value: number,
    private read: boolean,
    private scaleIn: number,
    private scaleOut: number,
    private index: string,
    private stage: string
  ) { }

  public setDependencies(list: string[]): Policy {
    this.dependencies = list

    return this
  }

  public toJSON(): any {
    const nameMetric = names.metric(this.read)
    const nameScalePolicy = names.policyScale(this.service, this.table, this.read, this.index, this.stage)
    const nameTarget = names.target(this.service, this.table, this.read, this.index, this.stage)

    const dependencies = [this.table, nameTarget ].concat(this.dependencies)

    return {
      [nameScalePolicy]: {
        DependsOn: dependencies,
        Properties: {
          PolicyName: nameScalePolicy,
          PolicyType: 'TargetTrackingScaling',
          ScalingTargetId: { Ref: nameTarget },
          TargetTrackingScalingPolicyConfiguration: {
            PredefinedMetricSpecification: {
              PredefinedMetricType: nameMetric
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
