import * as md5 from 'md5'
import * as util from 'util'

const TEXT = {
  DIMENSION: 'dynamodb:%s:%sCapacityUnits',
  METRIC: 'DynamoDB%sCapacityUtilization',
  POLICYROLE: 'DynamoDBAutoscalePolicy',
  POLICYSCALE: 'TableScalingPolicy-%s',
  ROLE: 'DynamoDBAutoscaleRole',
  TARGET: 'AutoScalingTarget-%s'
}

function clean(input: string): string {
  return truncate(input.replace(/[^a-z0-9+]+/gi, ''))
}

function truncate(input: string): string {
  return input.length <= 64 ? input : input.substr(0, 32) + md5(input)
}

function ucfirst(data: string): string {
  return data.charAt(0).toUpperCase() + data.slice(1)
}

export default class Name {
  constructor(private options: Options) { }

  public metricRead(): string {
    return this.metric(true)
  }

  public metricWrite(): string {
    return this.metric(false)
  }

  public targetRead(): string {
    return this.target(true)
  }

  public targetWrite(): string {
    return this.target(false)
  }

  public policyScaleRead(): string {
    return this.policyScale(true)
  }

  public policyScaleWrite(): string {
    return this.policyScale(false)
  }

  public policyRole(): string {
    return clean(
      this.build(TEXT.POLICYROLE)
    )
  }

  public dimension(read: boolean): string {
    const type = this.options.index === '' ? 'table' : 'index'

    return util.format(TEXT.DIMENSION, type, read ? 'Read' : 'Write')
  }

  public role(): string {
    return clean(this.build(TEXT.ROLE))
  }

  public target(read: boolean): string {
    return clean(
      this.build(TEXT.TARGET, read ? 'Read' : 'Write')
    )
  }

  public policyScale(read: boolean): string {
    return clean(
      this.build(TEXT.POLICYSCALE, read ? 'Read' : 'Write')
    )
  }

  public metric(read: boolean): string {
    return clean(
      util.format(TEXT.METRIC, read ? 'Read' : 'Write')
    )
  }

  private build(data: string, ...args: string[]): string {
    return [
      this.prefix(),
      args ? util.format(data, ...args) : data,
      this.suffix()
    ].join('')
  }

  private prefix(): string {
    return this.options.service
  }

  private suffix(): string {
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
    ].map(
      ucfirst
      ).join('')
  }
}
