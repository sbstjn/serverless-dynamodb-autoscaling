"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
class Target extends resource_1.default {
    constructor(options, read, min, max) {
        super(options);
        this.read = read;
        this.min = min;
        this.max = max;
        this.type = 'AWS::ApplicationAutoScaling::ScalableTarget';
    }
    toJSON() {
        const nameTarget = this.name.target(this.read);
        const nameRole = this.name.role();
        const nameDimension = this.name.dimension(this.read);
        let DependsOn;
        let resource;
        if (this.options.table && this.options.table['name'] && typeof this.options.table['name'] === 'string') {
            resource = `table/${this.options.table['name']}`;
            if (this.options.index !== '' || this.options.index.length > 0) {
                resource += `/index/${this.options.index}`;
            }
            DependsOn = [nameRole].concat(this.dependencies);
        }
        else {
            resource = ['table/', { Ref: this.options.table }];
            if (this.options.index !== '') {
                resource.push('/index/', this.options.index);
            }
            DependsOn = [this.options.table, nameRole].concat(this.dependencies);
            resource = { 'Fn::Join': ['', resource] };
        }
        return {
            [nameTarget]: {
                DependsOn,
                Properties: {
                    MaxCapacity: this.max,
                    MinCapacity: this.min,
                    ResourceId: resource,
                    RoleARN: { 'Fn::GetAtt': [nameRole, 'Arn'] },
                    ScalableDimension: nameDimension,
                    ServiceNamespace: 'dynamodb'
                },
                Type: this.type
            }
        };
    }
}
exports.default = Target;
//# sourceMappingURL=target.js.map