const util = require('util')

function clean (input) {
  return input.replace(/[^a-z0-9+]+/gi, '')
}

function policyScale (table, read, index, stage) {
  return clean(
    util.format(
      'Table%sScalingPolicy-%s%s%s',
      read ? 'Read' : 'Write',
      table,
      index || '',
      stage || ''
    )
  )
}

function policyRole (table, index, stage) {
  return clean(
    util.format(
      'DynamoDBAutoscalePolicy-%s%s%s',
      table,
      index || '',
      stage || ''
    )
  )
}

function dimension (read, index) {
  return util.format(
    'dynamodb:%s:%sCapacityUnits',
    index ? 'index' : 'table',
    read ? 'Read' : 'Write'
  )
}

function target (table, read, index, stage) {
  return clean(
    util.format(
      'AutoScalingTarget%s-%s%s%s',
      read ? 'Read' : 'Write',
      table,
      index || '',
      stage || ''
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
      'DynamoDBAutoscaleRole-%s%s%s',
      table,
      index || '',
      stage || ''
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
