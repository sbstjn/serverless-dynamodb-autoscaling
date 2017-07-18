# ⚡️ Serverless Plugin for DynamoDB Auto Scaling

[![npm](https://img.shields.io/npm/v/serverless-dynamodb-autoscaling.svg)](https://www.npmjs.com/package/serverless-dynamodb-autoscaling)
[![CircleCI](https://img.shields.io/circleci/project/github/sbstjn/serverless-dynamodb-autoscaling.svg)](https://circleci.com/gh/sbstjn/serverless-dynamodb-autoscaling)
[![license](https://img.shields.io/github/license/sbstjn/serverless-dynamodb-autoscaling.svg)](https://github.com/sbstjn/serverless-dynamodb-autoscaling/blob/master/LICENSE.md)
[![Coveralls](https://img.shields.io/coveralls/sbstjn/serverless-dynamodb-autoscaling.svg)](https://coveralls.io/github/sbstjn/serverless-dynamodb-autoscaling)

With this plugin for [serverless](https://serverless.com) you can set DynamoDB Auto Scaling configuratin in your `serverless.yml` file. The plugin supports multiple tables and separate configuration sets for `read` and `write` capacities.

**Warning:** *The created role policy uses `*` for resource access to DynamoDB. This needs to changed in an upcoming release. Be careful when you use this in a (sensitive) production environment!*

## Usage

Add the npm package to your project:

```bash
# Via yarn
$ yarn add serverless-dynamodb-autoscaling

# Via npm
$ npm install serverless-dynamodb-autoscaling --save
```

## Configuration

Add the plugin to your `serverless.yml`:

```yaml
plugins:
  - serverless-dynamodb-autoscaling
```

Configure DynamoDB Auto Scaling in `serverless.yml`:

```yaml
custom:
  capacities:
    - name: custom-table  # DynamoDB table name
      read:
        minimum: 5        # Minimum read capacity
        maximum: 1000     # Maximum read capacity
        usage: 0.75       # Targeted usage percentage
      write:
        minimum: 40       # Minimum write capacity
        maximum: 200      # Maximum write capacity
        usage: 0.5        # Targeted usage percentage
    - name: custom-table-2nd
      read:
        minimum: 5
        maximum: 1000
```

That's it! After the next deployment (`sls deploy`) serverless will configure your Auto Scaling for DynamoDB.

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

## Contribution

You are more than welcome to contribute to this project! 😘

To make sure you have a pleasant experience, please read the [code of conduct](CODE_OF_CONDUCT.md). It outlines core values and believes and will make working together a happier experience.
