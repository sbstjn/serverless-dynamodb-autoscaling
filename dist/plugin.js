"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const _ = require("lodash");
const util = require("util");
const policy_1 = require("./aws/policy");
const role_1 = require("./aws/role");
const target_1 = require("./aws/target");
const text = {
    CLI_DONE: 'Added DynamoDB Auto Scaling to CloudFormation!',
    CLI_RESOURCE: ' - Building configuration for resource "table/%s%s"',
    CLI_SKIP: 'Skipping DynamoDB Auto Scaling: %s!',
    CLI_START: 'Configure DynamoDB Auto Scaling …',
    INVALID_CONFIGURATION: 'Invalid serverless configuration',
    NO_AUTOSCALING_CONFIG: 'Not Auto Scaling configuration found',
    ONLY_AWS_SUPPORT: 'Only supported for AWS provicer'
};
class Plugin {
    /**
     * Constructur
     */
    constructor(serverless) {
        this.serverless = serverless;
        this.hooks = {
            'before:package:createDeploymentArtifacts': this.beforeDeployResources.bind(this)
        };
    }
    /**
     * Get the current stage name
     */
    getStage() {
        return this.serverless.getProvider('aws').getStage();
    }
    /**
     * Get the current service name
     */
    getServiceName() {
        return this.serverless.service.getServiceName();
    }
    /**
     * Get the current service region
     */
    getRegion() {
        return this.serverless.getProvider('aws').getRegion();
    }
    /**
     * Validate the request and check if configuration is available
     */
    validate() {
        assert(this.serverless, text.INVALID_CONFIGURATION);
        assert(this.serverless.service, text.INVALID_CONFIGURATION);
        assert(this.serverless.service.provider, text.INVALID_CONFIGURATION);
        assert(this.serverless.service.provider.name, text.INVALID_CONFIGURATION);
        assert(this.serverless.service.provider.name === 'aws', text.ONLY_AWS_SUPPORT);
        assert(this.serverless.service.custom, text.NO_AUTOSCALING_CONFIG);
        assert(this.serverless.service.custom.capacities, text.NO_AUTOSCALING_CONFIG);
    }
    /**
     * Parse configuration and fill up with default values when needed
     */
    defaults(config) {
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
        };
    }
    /**
     * Create CloudFormation resources for table (and optional index)
     */
    resources(table, index, config) {
        const data = this.defaults(config);
        const options = {
            index,
            region: this.getRegion(),
            service: this.getServiceName(),
            stage: this.getStage(),
            table
        };
        // Start processing configuration
        this.serverless.cli.log(util.format(text.CLI_RESOURCE, table['name'] ? table['name'] : table, (index ? ('/index/' + index) : '')));
        // Add role to manage Auto Scaling policies
        const resources = [
            new role_1.default(options)
        ];
        // Only add Auto Scaling for read capacity if configuration set is available
        if (!!config.read) {
            resources.push(...this.getPolicyAndTarget(options, data.read, true));
        }
        // Only add Auto Scaling for write capacity if configuration set is available
        if (!!config.write) {
            resources.push(...this.getPolicyAndTarget(options, data.write, false));
        }
        return resources;
    }
    /**
     * Create Policy and Target resource
     */
    getPolicyAndTarget(options, data, read) {
        return [
            new policy_1.default(options, read, data.usage * 100, 60, 60),
            new target_1.default(options, read, data.minimum, data.maximum)
        ];
    }
    /**
     * Generate CloudFormation resources for DynamoDB table and indexes
     */
    generate(table, config) {
        let resources = [];
        let lastRessources = [];
        const indexes = this.normalize(config.index);
        if (!config.indexOnly) {
            indexes.unshift(''); // Horrible solution
        }
        indexes.forEach((index) => {
            const current = this.resources(table, index, config).map((resource) => resource.setDependencies(lastRessources).toJSON());
            resources = resources.concat(current);
            lastRessources = current.map((item) => Object.keys(item).pop());
        });
        return resources;
    }
    /**
     * Check if parameter is defined and return as array if only a string is provided
     */
    normalize(data) {
        if (data && data.constructor !== Array) {
            return [data];
        }
        return (data || []).slice(0);
    }
    /**
     * Process the provided configuration
     */
    process() {
        this.serverless.service.custom.capacities.filter((config) => !!config.read || !!config.write).forEach((config) => this.normalize(config.table).forEach((table) => this.generate(table, config).forEach((resource) => _.merge(this.serverless.service.provider.compiledCloudFormationTemplate.Resources, resource))));
    }
    beforeDeployResources() {
        return Promise.resolve().then(() => this.validate()).then(() => this.serverless.cli.log(util.format(text.CLI_START))).then(() => this.process()).then(() => this.serverless.cli.log(util.format(text.CLI_DONE))).catch((err) => this.serverless.cli.log(util.format(text.CLI_SKIP, err.message)));
    }
}
module.exports = Plugin;
//# sourceMappingURL=plugin.js.map