const util = require('util')
const md5 = require('md5')

function clean (input) {
  return truncate(input.replace(/[^a-z0-9+]+/gi, ''))
}

function truncate (input) {
  return input.length <= 64 ? input : input.substr(0, 32) + md5(input)
}

function policyScale (service, table, read, index, stage) {
  return clean(
    util.format(
      '%sTable%sScalingPolicy-%s%s%s',
      service || '',
      read ? 'Read' : 'Write',
      table,
      index || '',
      stage || ''
    )
  )
}

function policyRole (service, table, index, stage) {
  return clean(
    util.format(
      '%sDynamoDBAutoscalePolicy-%s%s%s',
      service || '',
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

function target (service, table, read, index, stage) {
  return clean(
    util.format(
      '%sAutoScalingTarget%s-%s%s%s',
      service || '',
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

function role (service, table, index, stage) {
  return clean(
    util.format(
      '%sDynamoDBAutoscaleRole-%s%s%s',
      service || '',
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
