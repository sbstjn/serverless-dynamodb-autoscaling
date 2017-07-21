const names = require('./names')

class Target {
  constructor (table, min, max, read) {
    this.table = table
    this.min = parseInt(min, 10)
    this.max = parseInt(max, 10)
    this.read = !!read
  }

  toJSON () {
    const resource = [ 'table/', { 'Ref': this.table } ]

    if (this.index) {
      resource.push('/index/', this.index)
    }

    return {
      [names.target(this.table, this.read, this.index)]: {
        'Type': 'AWS::ApplicationAutoScaling::ScalableTarget',
        'DependsOn': [
          this.table,
          names.role(this.table, this.index)
        ],
        'Properties': {
          'MaxCapacity': this.max,
          'MinCapacity': this.min,
          'ResourceId': { 'Fn::Join': [ '', [ 'table/', { 'Ref': this.table } ] ] },
          'RoleARN': { 'Fn::GetAtt': [ names.role(this.table, this.index), 'Arn' ] },
          'ScalableDimension': names.dimension(this.read),
          'ServiceNamespace': 'dynamodb'
        }
      }
    }
  }
}

module.exports = Target
