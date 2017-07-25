const _ = require('lodash')
const util = require('util')
const assert = require('assert')

const Role = require('./aws/role')
const Target = require('./aws/target')
const Policy = require('./aws/policy')

class Plugin {
  /**
   * Constructur
   *
   * @param {object} serverless
   */
  constructor (serverless) {
    this.serverless = serverless
    this.hooks = {
      'deploy:compileEvents': this.beforeDeployResources.bind(this)
    }
  }

  /**
   * Validate the request and check if configuration is available
   */
  validate () {
    assert(this.serverless, 'Invalid serverless configuration')
    assert(this.serverless.service, 'Invalid serverless configuration')
    assert(this.serverless.service.provider, 'Invalid serverless configuration')
    assert(this.serverless.service.provider.name, 'Invalid serverless configuration')
    assert(this.serverless.service.provider.name === 'aws', 'Only supported for AWS provider')

    assert(this.serverless.service.provider.stage, 'Invalid serverless configuration')

    assert(this.serverless.service.custom, 'Not Auto Scaling configuration found')
    assert(this.serverless.service.custom.capacities, 'Not Auto Scaling configuration found')
  }

  /**
   * Parse configuration and fill up with default values when needed
   *
   * @param {object} config
   * @return {object}
   */
  defaults (config) {
    return {
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

  /**
   * Create CloudFormation resources for table (and optional index)
   *
   * @param {string} table
   * @param {string} index
   * @param {object} config
   */
  resources (table, index, config) {
    const resources = []
    const stage = this.serverless.service.provider.stage
    const data = this.defaults(config)

    // Start processing configuration
    this.serverless.cli.log(
      util.format(' - Building configuration for resource "table/%s%s"', table, (index ? ('/index/' + index) : ''))
    )

    // Add role to manage Auto Scaling policies
    resources.push(new Role(table, index, stage))

    // Only add Auto Scaling for read capacity if configuration set is available
    if (config.read) {
      resources.push(
        // ScaleIn/ScaleOut values are fix to 60% usage
        new Policy(table, data.read.usage, true, 60, 60, index, stage),
        new Target(table, data.read.minimum, data.read.maximum, true, index, stage)
      )
    }

    // Only add Auto Scaling for write capacity if configuration set is available
    if (config.write) {
      resources.push(
        // ScaleIn/ScaleOut values are fix to 60% usage
        new Policy(table, data.write.usage, false, 60, 60, index, stage),
        new Target(table, data.write.minimum, data.write.maximum, false, index, stage)
      )
    }

    return resources
  }

  /**
   * Generate CloudFormation resources for DynamoDB table and indexes
   *
   * @param {string} table
   * @param {obejct} config
   */
  generate (table, config) {
    let resources = []
    let lastRessources = []

    const indexes = this.normalize(config.index)
    if (!config.indexOnly) {
      indexes.unshift(null) // Horrible solution
    }

    indexes.forEach(
      index => {
        const current = this.resources(table, index, config).map(
          resource => resource.setDependencies(lastRessources).toJSON()
        )

        resources = resources.concat(current)
        lastRessources = current.map(item => Object.keys(item).pop())
      }
    )

    return resources
  }

  /**
   * Check if parameter is defined and return as array if only a string is provided
   *
   * @param {stirng|array} data
   * @return {array}
   */
  normalize (data) {
    if (!data) {
      return []
    }

    if (data.constructor !== Array) {
      return [data]
    }

    return data.slice(0)
  }

  /**
   * Process the provided configuration
   *
   * @return {Promise}
   */
  process () {
    if (this.serverless.service.custom) {
      this.serverless.service.custom.capacities.forEach(
        config => {
          // Skip set if no read or write scaling configuration is available
          if (!config.read && !config.write) {
            return this.serverless.cli.log(
              util.format(' - Skipping configuration for resource "%s"', config.table)
            )
          }

          // Walk every table in configuration
          this.normalize(config.table).forEach(
            table => this.generate(table, config).forEach(
              resource => _.merge(
                this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
                resource
              )
            )
          )
        }
      )
    }

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
    ).catch(
      err => this.serverless.cli.log(
        util.format('Skipping DynamoDB Auto Scaling: %s!', err.message)
      )
    )
  }
}

module.exports = Plugin
