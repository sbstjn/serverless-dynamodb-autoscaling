import * as names from './names'

export default class Role {
  private dependencies: string[] = []
  private type: string = 'AWS::IAM::Role'
  private version: string = '2012-10-17'
  private actions = {
    CloudWatch: [
      'cloudwatch:PutMetricAlarm',
      'cloudwatch:DescribeAlarms',
      'cloudwatch:DeleteAlarms',
      'cloudwatch:GetMetricStatistics',
      'cloudwatch:SetAlarmState'
    ],
    DynamoDB: [
      'dynamodb:DescribeTable',
      'dynamodb:UpdateTable'
    ]
  }

  constructor (
    private service: string,
    private table: string,
    private index: string,
    private stage: string
  ) { }

  public setDependencies(list: string[]): Role {
    this.dependencies = list

    return this
  }

  public toJSON(): any {
    const nameRole = names.role(this.service, this.table, this.index, this.stage)
    const namePolicyRole = names.policyRole(this.service, this.table, this.index, this.stage)

    const dependencies = [ this.table ].concat(this.dependencies)
    const principal = {
      Service: 'application-autoscaling.amazonaws.com'
    }
    const resource = {
      'Fn::Join': [ '', [ 'arn:aws:dynamodb:*:', { Ref: 'AWS::AccountId' }, ':table/', { Ref: this.table } ] ]
    }

    return {
      [nameRole]: {
        DependsOn: dependencies,
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              { Action: 'sts:AssumeRole', Effect: 'Allow', Principal: principal }
            ],
            Version: this.version
          },
          Policies: [
            {
              PolicyDocument: {
                Statement: [
                  { Action: this.actions.CloudWatch, Effect: 'Allow', Resource: '*' },
                  { Action: this.actions.DynamoDB, Effect: 'Allow', Resource: resource }
                ],
                Version: this.version
              },
              PolicyName: namePolicyRole
            }
          ],
          RoleName: nameRole
        },
        Type: this.type
      }
    }
  }
}
