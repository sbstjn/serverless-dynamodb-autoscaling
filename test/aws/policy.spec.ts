import Policy from '../../src/aws/policy'

describe('Policy', () => {
  it('creates CF resource for read capacity', () => {
    const p = new Policy({
      index: '',
      region: '',
      service: '',
      stage: '',
      table: 'MyTableResource'
    }, true, 75, 60, 70)

    const j = p.toJSON()

    expect(j).toHaveProperty('TableScalingPolicyReadMyTableResource')

    const d = j.TableScalingPolicyReadMyTableResource

    expect(d).toHaveProperty('Type', 'AWS::ApplicationAutoScaling::ScalingPolicy')

    const c = d.Properties.TargetTrackingScalingPolicyConfiguration

    expect(c).toHaveProperty('ScaleInCooldown', 60)
    expect(c).toHaveProperty('ScaleOutCooldown', 70)
    expect(c).toHaveProperty('TargetValue', 75)
  })

  it('creates CF resource for write capacity', () => {
    const p = new Policy({
      index: '',
      region: '',
      service: '',
      stage: '',
      table: 'MyTableResource'
    }, false, 10, 20, 30)

    const j = p.toJSON()

    expect(j).toHaveProperty('TableScalingPolicyWriteMyTableResource')

    const d = j.TableScalingPolicyWriteMyTableResource

    expect(d).toHaveProperty('Type', 'AWS::ApplicationAutoScaling::ScalingPolicy')

    const c = d.Properties.TargetTrackingScalingPolicyConfiguration

    expect(c).toHaveProperty('ScaleInCooldown', 20)
    expect(c).toHaveProperty('ScaleOutCooldown', 30)
    expect(c).toHaveProperty('TargetValue', 10)
  })
})
