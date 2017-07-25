# ⚡️ Serverless Plugin for DynamoDB Auto Scaling

[![npm](https://img.shields.io/npm/v/serverless-dynamodb-autoscaling.svg)](https://www.npmjs.com/package/serverless-dynamodb-autoscaling)
[![CircleCI](https://img.shields.io/circleci/project/github/sbstjn/serverless-dynamodb-autoscaling.svg)](https://circleci.com/gh/sbstjn/serverless-dynamodb-autoscaling)
[![license](https://img.shields.io/github/license/sbstjn/serverless-dynamodb-autoscaling.svg)](https://github.com/sbstjn/serverless-dynamodb-autoscaling/blob/master/LICENSE.md)
[![Coveralls](https://img.shields.io/coveralls/sbstjn/serverless-dynamodb-autoscaling.svg)](https://coveralls.io/github/sbstjn/serverless-dynamodb-autoscaling)

With this plugin for [serverless](https://serverless.com) you can enable DynamoDB Auto Scaling for tables and *Global Secondary Indexes* easily in your `serverless.yml` configuration file. The plugin supports multiple tables, indexes, as well separate configuration sets for `read` and `write` capacities using Amazon's [native DynamoDB Auto Scaling](https://aws.amazon.com/blogs/aws/new-auto-scaling-for-amazon-dynamodb/).

## Usage

Add the [NPM package](https://www.npmjs.com/package/serverless-dynamodb-autoscaling) to your project:

```bash
# Via yarn
$ yarn add serverless-dynamodb-autoscaling

# Via npm
$ npm install serverless-dynamodb-autoscaling
```

## Configuration

Add the plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-dynamodb-autoscaling
```

Configure DynamoDB Auto Scaling in `serverless.yml` with references to your DynamoDB CloudFormation resources for the `table` property. The `index` configuration is optional.

```yaml
custom:
  capacities:
    - table: CustomTable  # DynamoDB Resource
      index:              # List or single index name
        - custom-index-name
      read:
        minimum: 5        # Minimum read capacity
        maximum: 1000     # Maximum read capacity
        usage: 0.75       # Targeted usage percentage
      write:
        minimum: 40       # Minimum write capacity
        maximum: 200      # Maximum write capacity
        usage: 0.5        # Targeted usage percentage
```

That's it! With the next deployment serverless will add a CloudFormation configuration to enable Auto Scaling for the DynamoDB resources `CustomTable` and its **Global Secondary Index** called `custom-index-name`. 

You must of course provide at least a configuration for `read` or `write` to enable Auto Scaling. The value for `usage` has a default of 75 percent.

### Index

If you only want to enable Auto Scaling for the index, use `indexOnly: true` to skip Auto Scaling for the general DynamoDB table.

### API Throtteling

CloudWatch has very strict [API rate limitations](http://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_limits.html)! If you plan to configure Auto Scaling for multiple DynamoDB tables or *Global Secondary Index*, request an increase of the rate limits first! Otherwise you might run into an error like this:

```
An error occurred while provisioning your stack: XYZ - Unable to create alarms for scaling policy XYZ due to reason: 
Rate exceeded (Service: AmazonCloudWatch; Status Code: 400; Error Code: Throttling; Request ID: XYZ).
```

## DynamoDB

The example configuration above works fine for a DynamoDB table configuration like this:

```yaml
resources:
  Resources:
    CustomTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: custom-table
        AttributeDefinitions:
          - AttributeName: key
            AttributeType: S
        KeySchema:
          - AttributeName: key
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 5
          WriteCapacityUnits: 5
        GlobalSecondaryIndexes:
          - IndexName: custom-index-name
            KeySchema:
              - AttributeName: key
                KeyType: HASH
            Projection:
              ProjectionType: ALL
            ProvisionedThroughput:
              ReadCapacityUnits: 5
              WriteCapacityUnits: 5
```

## License

Feel free to use the code, it's released using the [MIT license](LICENSE.md).

## Thanks

- [TrentBartlem](https://github.com/TrentBartlem)'s [Gist](https://gist.github.com/TrentBartlem/292be37d496361d551fff6659d87fb0e) 
- [daniel](https://forums.aws.amazon.com/message.jspa?messageID=789667#jive-message-792127)'s post in the AWS Developer Forums

## Contribution

You are welcome to contribute to this project! 😘 

To make sure you have a pleasant experience, please read the [code of conduct](CODE_OF_CONDUCT.md). It outlines core values and believes and will make working together a happier experience.
