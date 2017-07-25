const util = require('util')

const clean = (input) => input.replace(/[^a-z0-9+]+/gi, '')

function policyScale (table, read, index, stage) {
  return clean(
    util.format(
      'Table%sScalingPolicy-%s%s', read ? 'Read' : 'Write',
      table,
      index || ''
    )
  )
}

function policyRole (table, index, stage) {
  return clean(
    util.format(
      'DynamoDBAutoscalePolicy-%s%s',
      table,
      index || ''
    )
  )
}

function dimension (read, index, stage) {
  return util.format(
    'dynamodb:%s:%sCapacityUnits',
    index ? 'index' : 'table',
    read ? 'Read' : 'Write'
  )
}

function target (table, read, index, stage) {
  return clean(
    util.format(
      'AutoScalingTarget%s-%s%s',
      read ? 'Read' : 'Write',
      table,
      index || ''
    )
  )
}

function metric (read) {
  return clean(
    util.format(
      'DynamoDB%sCapacityUtilization',
      read ? 'Read' : 'Write'
    )
  )
}

function role (table, index, stage) {
  return clean(
    util.format(
      'DynamoDBAutoscaleRole-%s%s',
      table,
      index || ''
    )
  )
}

module.exports = {
  clean,
  dimension,
  metric,
  policyRole,
  policyScale,
  role,
  target
}
