import { default as Name, Options } from './name'

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
    private options: Options
  ) { }

  public setDependencies(list: string[]): Role {
    this.dependencies = list

    return this
  }

  public toJSON(): any {
    const n = new Name(this.options)

    const RoleName = n.role()
    const PolicyName = n.policyRole()

    const DependsOn = [ this.options.table ].concat(this.dependencies)
    const Principal = this.principal()
    const Resource = this.resource()
    const Version = this.version
    const Type = this.type

    return {
      [RoleName]: {
        DependsOn,
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              { Action: 'sts:AssumeRole', Effect: 'Allow', Principal }
            ],
            Version
          },
          Policies: [
            {
              PolicyDocument: {
                Statement: [
                  { Action: this.actions.CloudWatch, Effect: 'Allow', Resource: '*' },
                  { Action: this.actions.DynamoDB, Effect: 'Allow', Resource }
                ],
                Version
              },
              PolicyName
            }
          ],
          RoleName
        },
        Type
      }
    }
  }

  private resource(): {} {
    return {
      'Fn::Join': [ '', [ 'arn:aws:dynamodb:*:', { Ref: 'AWS::AccountId' }, ':table/', { Ref: this.options.table } ] ]
    }
  }

  private principal(): {} {
    return {
      Service: 'application-autoscaling.amazonaws.com'
    }
  }
}
