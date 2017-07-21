const util = require('util')

const clean = (input) => input.replace(/[^a-z0-9+]+/gi, '')

const policyScale = (table, read, index) => clean(util.format('Table%sScalingPolicy-%s%s', read ? 'Read' : 'Write', table, index || ''))
const policyRole = (table, index) => clean(util.format('DynamoDBAutoscalePolicy-%s%s', table, index || ''))
const dimension = (read, index) => util.format('dynamodb:%s:%sCapacityUnits', index ? 'index' : 'table', read ? 'Read' : 'Write')
const target = (table, read, index) => clean(util.format('AutoScalingTarget%s-%s%s', read ? 'Read' : 'Write', table, index || ''))
const metric = (read) => clean(util.format('DynamoDB%sCapacityUtilization', read ? 'Read' : 'Write'))
const role = (table, index) => clean(util.format('DynamoDBAutoscaleRole-%s%s', table, index || ''))

module.exports = { dimension, metric, policyScale, policyRole, role, target, clean }
