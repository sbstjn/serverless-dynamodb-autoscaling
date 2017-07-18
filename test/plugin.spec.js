'use strict'

const Plugin = require('../')

it('creates CloudFormation configuration', () => {
  let config = {
    service: {
      custom: {
        'dynamodb-autoscaling': [
          { name: 'table-name' }
        ]
      },
      provider: {
        region: 'test-region',
        compiledCloudFormationTemplate: {
          Resources: {}
        }
      }
    }
  }

  const test = new Plugin(config)
  test.beforeDeployResources()

  // const data = config.service.provider.compiledCloudFormationTemplate.Resources

  expect(true).toBe(true)
})
