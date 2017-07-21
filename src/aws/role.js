const names = require('./names')

class Role {
  constructor (table) {
    this.table = table
  }

  toJSON () {
    return {
      [names.role(this.table)]: {
        'Type': 'AWS::IAM::Role',
        'DependsOn': [
          this.table
        ],
        'Properties': {
          'RoleName': names.role(this.table),
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
              'PolicyName': names.policyRole(this.table),
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
