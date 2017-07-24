const names = require('./names')

class Role {
  constructor (table, index) {
    this.table = table
    this.index = index
    this.dependencies = []
  }

  setDependencies (list) {
    this.dependencies = list
  }

  toJSON () {
    return {
      [names.role(this.table, this.index)]: {
        'Type': 'AWS::IAM::Role',
        'DependsOn': [
          this.table
        ].concat(this.dependencies),
        'Properties': {
          'RoleName': names.role(this.table, this.index),
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
              'PolicyName': names.policyRole(this.table, this.index),
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
