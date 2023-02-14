export type StockData = {
  name: string
  prices: {
    current: number
    changed: number
    changePercent: number
    high: number
    low: number
    closep: number
    ycp: number
    trade: number
    value: number
    volume: number
  }
}

export type CompanyDataType = {
  index: number
  trading_code: string
  ltp: number
  high: number
  low: number
  closep: number
  ycp: number
  change: number
  trade: number
  value: number
  volume: number
}

export type CompanyData = CompanyDataType[]
