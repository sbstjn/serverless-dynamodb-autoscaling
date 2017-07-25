const names = require('./names')

class Target {
  constructor (table, min, max, read, index, stage) {
    this.table = table
    this.index = index
    this.stage = stage
    this.min = parseInt(min, 10)
    this.max = parseInt(max, 10)
    this.read = !!read
    this.dependencies = []
  }

  setDependencies (list) {
    this.dependencies = list

    return this
  }

  toJSON () {
    const resource = [ 'table/', { 'Ref': this.table } ]

    if (this.index) {
      resource.push('/index/', this.index)
    }

    return {
      [names.target(this.table, this.read, this.index, this.stage)]: {
        'Type': 'AWS::ApplicationAutoScaling::ScalableTarget',
        'DependsOn': [ this.table, names.role(this.table, this.index, this.stage) ].concat(this.dependencies),
        'Properties': {
          'MaxCapacity': this.max,
          'MinCapacity': this.min,
          'ResourceId': { 'Fn::Join': [ '', resource ] },
          'RoleARN': { 'Fn::GetAtt': [ names.role(this.table, this.index, this.stage), 'Arn' ] },
          'ScalableDimension': names.dimension(this.read, this.index),
          'ServiceNamespace': 'dynamodb'
        }
      }
    }
  }
}

module.exports = Target
