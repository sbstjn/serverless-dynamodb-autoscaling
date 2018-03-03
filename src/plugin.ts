import * as assert from 'assert'
import * as _ from 'lodash'
import * as util from 'util'

import Policy from './aws/policy'
import Role from './aws/role'
import Target from './aws/target'
import Resource from './aws/resource'
import { coerceToArray, getFirstKey } from './utils'

const text = {
  CLI_DONE: 'Added DynamoDB Auto Scaling to CloudFormation!',
  CLI_RESOURCE: ' - Building configuration for resource "table/%s%s"',
  CLI_SKIP: 'Skipping DynamoDB Auto Scaling: %s!',
  CLI_START: 'Configure DynamoDB Auto Scaling …',
  INVALID_CONFIGURATION: 'Invalid serverless configuration',
  NO_AUTOSCALING_CONFIG: 'No Auto Scaling configuration found',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provicer'
}

interface Defaults {
  read: CapacityConfiguration,
  write: CapacityConfiguration
}

class AWSDBAutoScaling {
  public hooks: {}
  private options: AutoScalingOptions

  /**
   * Constructur
   */
  constructor (private serverless: Serverless) {
    this.hooks = {
      'package:compileEvents': this.beforeDeployResources.bind(this)
    }
  }

  /**
   * Get the current stage name
   */
  private getStage(): string {
    return this.serverless.getProvider('aws').getStage()
  }

  /**
   * Get the current service name
   */
  private getServiceName(): string {
    return this.serverless.service.getServiceName()
  }

  /**
   * Get the current service region
   */
  private getRegion(): string {
    return this.serverless.getProvider('aws').getRegion()
  }

  /**
   * Validate the request and check if configuration is available
   */
  private validate(): void {
    assert(this.serverless, text.INVALID_CONFIGURATION)
    assert(this.serverless.service, text.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider, text.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider.name, text.INVALID_CONFIGURATION)
    assert(this.serverless.service.provider.name === 'aws', text.ONLY_AWS_SUPPORT)

    assert(this.serverless.service.custom, text.NO_AUTOSCALING_CONFIG)
    assert(this.options.capacities, text.NO_AUTOSCALING_CONFIG)
  }

  /**
   * Parse configuration and fill up with default values when needed
   */
  private defaults(config: Capacity): Defaults {
    return {
      read: {
        maximum: config.read && config.read.maximum ? config.read.maximum : 200,
        minimum: config.read && config.read.minimum ? config.read.minimum : 5,
        usage: config.read && config.read.usage ? config.read.usage : 0.75
      },
      write: {
        maximum: config.write && config.write.maximum ? config.write.maximum : 200,
        minimum: config.write && config.write.minimum ? config.write.minimum : 5,
        usage: config.write && config.write.usage ? config.write.usage : 0.75
      }
    }
  }

  /**
   * Create CloudFormation resources for table (and optional index)
   */
  private resources(table: string, index: string, config: Capacity): Resource[] {
    const data = this.defaults(config)

    const options: Options = {
      index,
      region: this.getRegion(),
      service: this.getServiceName(),
      stage: this.getStage(),
      table,
      role: this.options.role
    }

    // Start processing configuration
    this.serverless.cli.log(
      util.format(text.CLI_RESOURCE, table, (index ? ('/index/' + index) : ''))
    )

    // Add role to manage Auto Scaling policies
    const resources: any[] = []
    if (!this.options.role) {
      resources.push(new Role(options))
    }

    // Only add Auto Scaling for read capacity if configuration set is available
    if (!!config.read) {
      resources.push(...this.getPolicyAndTarget(options, data.read, true))
    }

    // Only add Auto Scaling for write capacity if configuration set is available
    if (!!config.write) {
      resources.push(...this.getPolicyAndTarget(options, data.write, false))
    }

    return resources
  }

  /**
   * Create Policy and Target resource
   */
  private getPolicyAndTarget(options: Options, data: CapacityConfiguration, read: boolean): any[] {
    return [
      new Policy(options, read, data.usage * 100, 60, 60),
      new Target(options, read, data.minimum, data.maximum)
    ]
  }

  /**
   * Generate CloudFormation resources for DynamoDB table and indexes
   */
  private generate(table: string, config: Capacity) {
    let resources: Resource[] = []
    let lastRessources: string[] = []

    const indexes = coerceToArray(config.index)
    if (!config.indexOnly) {
      indexes.unshift('') // Horrible solution
    }

    indexes.forEach(
      (index: string) => {
        const current = this.resources(table, index, config).map(
          resource => resource.setDependencies(lastRessources).toJSON()
        )

        resources = resources.concat(current)
        lastRessources = current.map(getFirstKey)
      }
    )

    return resources
  }

  /**
   * Process the provided configuration
   */
  private process() {
    const { capacities } = this.options
    const allResources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources
    capacities.filter(
      (config: Capacity) => !!config.read || !!config.write
    ).forEach(
      (config: Capacity) => coerceToArray(config.table).forEach(
        (table: string) => this.generate(table, config).forEach(
          (resources: any) => _.merge(allResources, resources)
        )
      )
    )
  }

  private beforeDeployResources(): Promise<any> {
    return Promise.resolve().then(
      () => {
        this.options = this.serverless.service.custom['dynamodb-autoscaling']
        this.validate()
      }
    ).then(
      () => this.serverless.cli.log(util.format(text.CLI_START))
    ).then(
      () => this.process()
    ).then(
      () => this.serverless.cli.log(util.format(text.CLI_DONE))
    ).catch(
      (err: Error) => this.serverless.cli.log(util.format(text.CLI_SKIP, err.message))
    )
  }
}

module.exports = AWSDBAutoScaling
