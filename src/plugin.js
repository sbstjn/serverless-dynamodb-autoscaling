'use strict'

const _ = require('lodash')
const util = require('util')
const assert = require('assert')

const Role = require('./aws/role')
const Target = require('./aws/target')
const Policy = require('./aws/policy')

class Plugin {
  constructor (serverless, options) {
    this.serverless = serverless
    this.hooks = {
      'deploy:compileEvents': this.beforeDeployResources.bind(this)
    }
  }

  validate () {
    assert(this.serverless, 'Invalid serverless configuration')
    assert(this.serverless.service, 'Invalid serverless configuration')
    assert(this.serverless.service.provider, 'Invalid serverless configuration')
    assert(this.serverless.service.provider.name, 'Invalid serverless configuration')
    assert(this.serverless.service.provider.name === 'aws', 'Only supported for AWS provider')

    assert(this.serverless.service.custom.capacities, 'No Auto Scaling configuration found')
  }

  defaults (table, config) {
    return {
      table: table,
      read: {
        usage: config.read && config.read.usage ? config.read.usage : 0.75,
        minimum: config.read && config.read.minimum ? config.read.minimum : 5,
        maximum: config.read && config.read.maximum ? config.read.maximum : 200
      },
      write: {
        usage: config.write && config.write.usage ? config.write.usage : 0.75,
        minimum: config.write && config.write.minimum ? config.write.minimum : 5,
        maximum: config.write && config.write.maximum ? config.write.maximum : 200
      }
    }
  }

  resources (table, config, index) {
    const data = this.defaults(table, config)
    const resources = []
    const indexes = []

    if (!config.indexOnly) {
      indexes.push(null) // Horrible solution
    }

    if (index) {
      if (index.constructor !== Array) {
        indexes.push(index)
      } else {
        index.forEach(index => indexes.push(index))
      }
    }

    indexes.forEach(index => {
      // Start processing configuration
      this.serverless.cli.log(
        util.format(' - Building configuration for resource "%s%s"', data.table, (index ? ('/index/' + index) : ''))
      )

      // Add role to manage Auto Scaling policies
      resources.push(new Role(data.table, index))

      // Only add Auto Scaling for read capacity if configuration set is available
      if (config.read) {
        resources.push(
          new Policy(data.table, data.read.usage, true, 60, 60, index),
          new Target(data.table, data.read.minimum, data.read.maximum, true, index)
        )
      }

      // Only add Auto Scaling for write capacity if configuration set is available
      if (config.write) {
        resources.push(
          new Policy(data.table, data.write.usage, false, 60, 60, index),
          new Target(data.table, data.write.minimum, data.write.maximum, false, index)
        )
      }
    })

    return resources
  }

  process () {
    this.serverless.service.custom.capacities.map(
      config => {
        // Skip set if no read or write scaling configuration is available
        if (!config.read && !config.write) {
          return this.serverless.cli.log(
            util.format(' - Skipping configuration for resource "%s"', config.table)
          )
        }

        const tables = []
        if (config.table.constructor !== Array) {
          tables.push(config.table)
        } else {
          config.table.forEach(table => tables.push(table))
        }

        tables.forEach(table => {
          const resources = this.resources(table, config, config.index)

          // Inject templates in serverless CloudFormation template
          resources.forEach(
            resource => _.merge(
              this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
              resource.toJSON()
            )
          )
        })
      }
    )

    return Promise.resolve()
  }

  beforeDeployResources () {
    return Promise.resolve().then(
      this.validate.bind(this)
    ).then(
      () => this.serverless.cli.log(
        util.format('Configure DynamoDB Auto Scaling …')
      )
    ).then(
      this.process.bind(this)
    ).then(
      () => this.serverless.cli.log(
        util.format('Added DynamoDB Auto Scaling to CloudFormation!')
      )
    )/* .catch(
      err => this.serverless.cli.log(
        util.format('Skipping DynamoDB Auto Scaling: %s!', err.message)
      ) && console.log(err)
    ) */
  }
}

module.exports = Plugin
