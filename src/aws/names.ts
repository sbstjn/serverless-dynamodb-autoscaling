import * as md5 from 'md5'
import * as util from 'util'

export function clean(input: string): string {
  return truncate(input.replace(/[^a-z0-9+]+/gi, ''))
}

export function truncate(input: string): string {
  return input.length <= 64 ? input : input.substr(0, 32) + md5(input)
}

export function policyScale(service: string, table: string, read: boolean, index?: string, stage?: string): string {
  return clean(
    util.format(
      '%sTable%sScalingPolicy-%s%s%s',
      service,
      read ? 'Read' : 'Write',
      table,
      index || '',
      stage || ''
    )
  )
}

export function policyRole(service: string, table: string, index?: string, stage?: string): string {
  return clean(
    util.format(
      '%sDynamoDBAutoscalePolicy-%s%s%s',
      service,
      table,
      index || '',
      stage || ''
    )
  )
}

export function dimension(read: boolean, index: boolean): string {
  return util.format(
    'dynamodb:%s:%sCapacityUnits',
    index ? 'index' : 'table',
    read ? 'Read' : 'Write'
  )
}

export function target(service: string, table: string, read: boolean, index?: string, stage?: string): string {
  return clean(
    util.format(
      '%sAutoScalingTarget%s-%s%s%s',
      service,
      read ? 'Read' : 'Write',
      table,
      index || '',
      stage || ''
    )
  )
}

export function metric(read: boolean): string {
  return clean(
    util.format(
      'DynamoDB%sCapacityUtilization',
      read ? 'Read' : 'Write'
    )
  )
}

export function role(service: string, table: string, index?: string, stage?: string): string {
  return clean(
    util.format(
      '%sDynamoDBAutoscaleRole-%s%s%s',
      service,
      table,
      index || '',
      stage || ''
    )
  )
}
