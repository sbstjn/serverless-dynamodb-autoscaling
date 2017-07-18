const util = require('util')
const names = require('./names')

class Target {
  constructor (table, min, max, read) {
    this.table = table
    this.min = parseInt(min, 10)
    this.max = parseInt(max, 10)
    this.read = !!read
  }

  toJSON () {
    return {
      [names.target(this.table, this.read)]: {
        'Type': 'AWS::ApplicationAutoScaling::ScalableTarget',
        'DependsOn': names.role(this.table),
        'Properties': {
          'MaxCapacity': this.max,
          'MinCapacity': this.min,
          'ResourceId': util.format('table/%s', this.table),
          'RoleARN': { 'Fn::GetAtt': [ names.role(this.table), 'Arn' ] },
          'ScalableDimension': names.dimension(this.read),
          'ServiceNamespace': 'dynamodb'
        }
      }
    }
  }
}

module.exports = Target
