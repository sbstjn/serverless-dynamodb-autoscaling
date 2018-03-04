export const coerceToArray = <T>(data: T|T[]): T[] => {
  return ([] as T[]).concat(data || [])
}

export const getFirstKey = (obj: any):string => Object.keys(obj).pop() as string
