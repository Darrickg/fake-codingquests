export const money = (n: number) =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
