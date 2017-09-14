"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5");
const util = require("util");
const TEXT = {
    DIMENSION: 'dynamodb:%s:%sCapacityUnits',
    METRIC: 'DynamoDB%sCapacityUtilization',
    POLICYROLE: 'DynamoDBAutoscalePolicy',
    POLICYSCALE: 'TableScalingPolicy-%s',
    ROLE: 'DynamoDBAutoscaleRole',
    TARGET: 'AutoScalingTarget-%s'
};
function clean(input) {
    return truncate(input.replace(/[^a-z0-9+]+/gi, ''));
}
function truncate(input) {
    return input.length <= 64 ? input : input.substr(0, 32) + md5(input);
}
function ucfirst(data) {
    return data.charAt(0).toUpperCase() + data.slice(1);
}
class Name {
    constructor(options) {
        this.options = options;
    }
    metricRead() {
        return this.metric(true);
    }
    metricWrite() {
        return this.metric(false);
    }
    targetRead() {
        return this.target(true);
    }
    targetWrite() {
        return this.target(false);
    }
    policyScaleRead() {
        return this.policyScale(true);
    }
    policyScaleWrite() {
        return this.policyScale(false);
    }
    policyRole() {
        return clean(this.build(TEXT.POLICYROLE));
    }
    dimension(read) {
        const type = this.options.index === '' ? 'table' : 'index';
        return util.format(TEXT.DIMENSION, type, read ? 'Read' : 'Write');
    }
    role() {
        return clean(this.build(TEXT.ROLE));
    }
    target(read) {
        return clean(this.build(TEXT.TARGET, read ? 'Read' : 'Write'));
    }
    policyScale(read) {
        return clean(this.build(TEXT.POLICYSCALE, read ? 'Read' : 'Write'));
    }
    metric(read) {
        return clean(util.format(TEXT.METRIC, read ? 'Read' : 'Write'));
    }
    build(data, ...args) {
        return [
            this.prefix(),
            args ? util.format(data, ...args) : data,
            this.suffix()
        ].join('');
    }
    prefix() {
        return this.options.service;
    }
    suffix() {
        if (this.options.table['name']) {
            return [
                this.options.table['name'],
                this.options.index,
                this.options.stage,
                this.options.region
            ].map(ucfirst).join('');
        }
        return [
            this.options.table,
            this.options.index,
            this.options.stage,
            this.options.region
        ].map(ucfirst).join('');
    }
}
exports.default = Name;
//# sourceMappingURL=name.js.map