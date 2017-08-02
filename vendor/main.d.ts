declare interface Capacity {
  table: string | string[]
  index: string | string[]
  indexOnly?: boolean
  write?: CapacityConfiguration
  read?: CapacityConfiguration
}

declare interface CapacityConfiguration {
  maximum: number
  minimum: number
  usage: number
}
