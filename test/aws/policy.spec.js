const names = require('../../src/aws/names')
const Policy = require('../../src/aws/policy')

describe('Policy', () => {
  it('creates CF resource for read capacity', () => {
    const p = new Policy('', 'my-table-name', 0.75, true, 60, 70)
    const j = p.toJSON()

    expect(j).toHaveProperty(names.policyScale('', 'my-table-name', true))

    const d = j[names.policyScale('', 'my-table-name', true)]

    expect(d).toHaveProperty('Type', 'AWS::ApplicationAutoScaling::ScalingPolicy')
    expect(d).toHaveProperty('Properties.PolicyName', names.policyScale('', 'my-table-name', true))
    expect(d).toHaveProperty('Properties.PolicyType', 'TargetTrackingScaling')
    expect(d).toHaveProperty('Properties.ScalingTargetId', { 'Ref': names.target('', 'my-table-name', true) })
    expect(d).toHaveProperty('Properties.TargetTrackingScalingPolicyConfiguration.PredefinedMetricSpecification.PredefinedMetricType', names.metric(true))

    const c = d.Properties.TargetTrackingScalingPolicyConfiguration

    expect(c).toHaveProperty('ScaleInCooldown', 60)
    expect(c).toHaveProperty('ScaleOutCooldown', 70)
    expect(c).toHaveProperty('TargetValue', 75)
  })

  it('creates CF resource for write capacity', () => {
    const p = new Policy('', 'my-table-name', 0.15, false, 60, 70)
    const j = p.toJSON()

    expect(j).toHaveProperty(names.policyScale('', 'my-table-name', false))

    const d = j[names.policyScale('', 'my-table-name', false)]

    expect(d).toHaveProperty('Type', 'AWS::ApplicationAutoScaling::ScalingPolicy')
    expect(d).toHaveProperty('Properties.PolicyName', names.policyScale('', 'my-table-name', false))
    expect(d).toHaveProperty('Properties.PolicyType', 'TargetTrackingScaling')
    expect(d).toHaveProperty('Properties.ScalingTargetId', { 'Ref': names.target('', 'my-table-name', false) })
    expect(d).toHaveProperty('Properties.TargetTrackingScalingPolicyConfiguration.PredefinedMetricSpecification.PredefinedMetricType', names.metric(false))

    const c = d.Properties.TargetTrackingScalingPolicyConfiguration

    expect(c).toHaveProperty('ScaleInCooldown', 60)
    expect(c).toHaveProperty('ScaleOutCooldown', 70)
    expect(c).toHaveProperty('TargetValue', 15)
  })
})
