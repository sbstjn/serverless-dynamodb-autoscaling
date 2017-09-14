"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
class Policy extends resource_1.default {
    constructor(options, read, value, scaleIn, scaleOut) {
        super(options);
        this.read = read;
        this.value = value;
        this.scaleIn = scaleIn;
        this.scaleOut = scaleOut;
        this.type = 'AWS::ApplicationAutoScaling::ScalingPolicy';
    }
    toJSON() {
        const PredefinedMetricType = this.name.metric(this.read);
        const PolicyName = this.name.policyScale(this.read);
        const Target = this.name.target(this.read);
        let DependsOn;
        if (this.options.table && this.options.table['name'] && typeof this.options.table['name'] === 'string') {
            DependsOn = [Target].concat(this.dependencies);
        }
        else {
            DependsOn = [this.options.table, Target].concat(this.dependencies);
        }
        return {
            [PolicyName]: {
                DependsOn,
                Properties: {
                    PolicyName,
                    PolicyType: 'TargetTrackingScaling',
                    ScalingTargetId: { Ref: Target },
                    TargetTrackingScalingPolicyConfiguration: {
                        PredefinedMetricSpecification: {
                            PredefinedMetricType
                        },
                        ScaleInCooldown: this.scaleIn,
                        ScaleOutCooldown: this.scaleOut,
                        TargetValue: this.value
                    }
                },
                Type: this.type
            }
        };
    }
}
exports.default = Policy;
//# sourceMappingURL=policy.js.map