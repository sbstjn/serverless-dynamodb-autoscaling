# ⚡️ Serverless Plugin for DynamoDB Auto Scaling

[![npm](https://img.shields.io/npm/v/serverless-dynamodb-autoscaling.svg)](https://www.npmjs.com/package/serverless-dynamodb-autoscaling)
[![CircleCI](https://img.shields.io/circleci/project/github/sbstjn/serverless-dynamodb-autoscaling.svg)](https://circleci.com/gh/sbstjn/serverless-dynamodb-autoscaling)
[![license](https://img.shields.io/github/license/sbstjn/serverless-dynamodb-autoscaling.svg)](https://github.com/sbstjn/serverless-dynamodb-autoscaling/blob/master/LICENSE.md)
[![Coveralls](https://img.shields.io/coveralls/sbstjn/serverless-dynamodb-autoscaling.svg)](https://coveralls.io/github/sbstjn/serverless-dynamodb-autoscaling)

With this plugin for [serverless](https://serverless.com) you can set DynamoDB Auto Scaling configuratin in your `serverless.yml` file. The plugin supports multiple tables and separate configuration sets for `read` and `write` capacities using AWS [native DynamoDB Auto Scaling](https://aws.amazon.com/blogs/aws/new-auto-scaling-for-amazon-dynamodb/).

## Usage

Add the [NPM package](https://www.npmjs.com/package/serverless-dynamodb-autoscaling) to your project:

```bash
# Via yarn
$ yarn add serverless-dynamodb-autoscaling

# Via npm
$ npm install serverless-dynamodb-autoscaling --save-dev
```

## Configuration

Add the plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-dynamodb-autoscaling
```

Configure DynamoDB Auto Scaling in `serverless.yml` with references to your DynamoDB CloudFormation resources:

```yaml
custom:
  capacities:
    - table: CustomTable  # DynamoDB Resource
      read:
        minimum: 5        # Minimum read capacity
        maximum: 1000     # Maximum read capacity
        usage: 0.75       # Targeted usage percentage
      write:
        minimum: 40       # Minimum write capacity
        maximum: 200      # Maximum write capacity
        usage: 0.5        # Targeted usage percentage
    - table: AnotherTable
      read:
        minimum: 5
        maximum: 1000
        # usage: 0.75 is the default
```

That's it! With the next deployment (`sls deploy`) serverless will add a CloudFormation configuration to enable Auto Scaling for the DynamoDB resources `CustomTable` and `AnotherTable`.

You must of course provide at least a configuration for `read` or `write` to enable Auto Scaling. The value for `usage` has a default of 75 percent.

**Notice:** *With the relese of `v0.2.x` the plugin introduced a breaking change. Starting with `v0.2.0` you need to provide the CloudFormation reference for the `table` property. In `v0.1.x` the plugin used a `name` property with the DynamoDB table name.

## DynamoDB

The configuration above works fine for a default DynamoDB table configuration.

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
```

## License

Feel free to use the code, it's released using the [MIT license](LICENSE.md).

## Thanks

- [TrentBartlem](https://github.com/TrentBartlem)'s [Gist](https://gist.github.com/TrentBartlem/292be37d496361d551fff6659d87fb0e) 
- [daniel](https://forums.aws.amazon.com/message.jspa?messageID=789667#jive-message-792127)'s post in the AWS Developer Forums

## Contribution

You are welcome to contribute to this project! 😘 

To make sure you have a pleasant experience, please read the [code of conduct](CODE_OF_CONDUCT.md). It outlines core values and believes and will make working together a happier experience.
