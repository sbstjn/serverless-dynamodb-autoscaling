const util = require('util')

const clean = (input) => input.replace(/[^a-z0-9+]+/gi, '')

const policyScale = (table, read) => clean(util.format('Table%sScalingPolicy-%s', read ? 'Read' : 'Write', table))
const policyRole = (table) => clean(util.format('DynamoDBAutoscalePolicy-%s', table))
const dimension = (read) => util.format('dynamodb:table:%sCapacityUnits', read ? 'Read' : 'Write')
const target = (table, read) => clean(util.format('AutoScalingTarget%s-%s', read ? 'Read' : 'Write', table))
const metric = (read) => clean(util.format('DynamoDB%sCapacityUtilization', read ? 'Read' : 'Write'))
const role = (table) => clean(util.format('DynamoDBAutoscaleRole-%s', table))

module.exports = { dimension, metric, policyScale, policyRole, role, target, clean }
