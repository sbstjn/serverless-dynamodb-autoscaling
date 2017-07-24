const names = require('./names')

class Policy {
  constructor (table, value, read, scaleIn, scaleOut, index) {
    this.table = table
    this.index = index
    this.value = parseFloat(value, 10) * 100
    this.read = !!read
    this.scaleIn = parseInt(scaleIn, 10)
    this.scaleOut = parseInt(scaleOut, 10)
    this.dependencies = []
  }

  setDependencies (list) {
    this.dependencies = list
  }

  toJSON () {
    return {
      [names.policyScale(this.table, this.read, this.index)]: {
        'Type': 'AWS::ApplicationAutoScaling::ScalingPolicy',
        'DependsOn': [
          this.table,
          names.target(this.table, this.read, this.index)
        ].concat(this.dependencies),
        'Properties': {
          'PolicyName': names.policyScale(this.table, this.read, this.index),
          'PolicyType': 'TargetTrackingScaling',
          'ScalingTargetId': { 'Ref': names.target(this.table, this.read, this.index) },
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
