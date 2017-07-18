const names = require('./names')

class Policy {
  constructor (table, value, read, scaleIn, scaleOut) {
    this.table = table
    this.value = parseFloat(value, 10) * 100
    this.read = !!read
    this.scaleIn = parseInt(scaleIn, 10)
    this.scaleOut = parseInt(scaleOut, 10)
  }

  toJSON () {
    return {
      [names.policyScale(this.table, this.read)]: {
        'Type': 'AWS::ApplicationAutoScaling::ScalingPolicy',
        'Properties': {
          'PolicyName': names.policyScale(this.table, this.read),
          'PolicyType': 'TargetTrackingScaling',
          'ScalingTargetId': { 'Ref': names.target(this.table, this.read) },
          'TargetTrackingScalingPolicyConfiguration': {
            'PredefinedMetricSpecification': {
              'PredefinedMetricType': names.metric(this.read)
            },
            'ScaleInCooldown': this.scaleIn,
            'ScaleOutCooldown': this.scaleOut,
            'TargetValue': this.value
          }
        }
      }
    }
  }
}

module.exports = Policy
