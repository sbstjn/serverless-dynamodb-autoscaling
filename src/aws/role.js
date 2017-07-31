const names = require('./names')

class Role {
  constructor (service, table, index, stage) {
    this.service = service
    this.table = table
    this.index = index
    this.stage = stage
    this.dependencies = []
  }

  setDependencies (list) {
    this.dependencies = list

    return this
  }

  toJSON () {
    return {
      [names.role(this.service, this.table, this.index, this.stage)]: {
        'Type': 'AWS::IAM::Role',
        'DependsOn': [ this.table ].concat(this.dependencies),
        'Properties': {
          'RoleName': names.role(this.service, this.table, this.index, this.stage),
          'AssumeRolePolicyDocument': {
            'Version': '2012-10-17',
            'Statement': [
              {
                'Effect': 'Allow',
                'Principal': {
                  'Service': 'application-autoscaling.amazonaws.com'
                },
                'Action': 'sts:AssumeRole'
              }
            ]
          },
          'Policies': [
            {
              'PolicyName': names.policyRole(this.service, this.table, this.index, this.stage),
              'PolicyDocument': {
                'Version': '2012-10-17',
                'Statement': [
                  {
                    'Effect': 'Allow',
                    'Action': [
                      'cloudwatch:PutMetricAlarm',
                      'cloudwatch:DescribeAlarms',
                      'cloudwatch:DeleteAlarms',
                      'cloudwatch:GetMetricStatistics',
                      'cloudwatch:SetAlarmState'
                    ],
                    'Resource': '*'
                  },
                  {
                    'Effect': 'Allow',
                    'Action': [
                      'dynamodb:DescribeTable',
                      'dynamodb:UpdateTable'
                    ],
                    'Resource': { 'Fn::Join': [ '', [ 'arn:aws:dynamodb:*:', { 'Ref': 'AWS::AccountId' }, ':table/', { 'Ref': this.table } ] ] }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}

module.exports = Role
