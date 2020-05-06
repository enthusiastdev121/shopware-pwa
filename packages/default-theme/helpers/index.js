import dayjs from 'dayjs'
import currency from 'currency.js'

const defaultFormatPriceOptions = {
  pattern: `# !`,
  separator: ` `,
  decimal: `,`,
  symbol: `€`,
  formatWithSymbol: true,
}

export function formatPrice(price, options) {
  return currency(
    price,
    Object.assign(defaultFormatPriceOptions, options)
  ).format()
}

export const getSortingLabel = (sorting) => {
  if (!sorting || !sorting.order || !sorting.field) {
    return ''
  }

  const ascLabel = 'ascending'
  const descLabel = 'descending'

  const label = sorting.order === 'desc' ? descLabel : ascLabel
  return `${sorting.field} ${label}`
}

export const formatDate = (date, format = `DD-MM-YYYY H:m:s`) =>
  dayjs(date).format(format)
