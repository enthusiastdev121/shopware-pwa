import dayjs from "dayjs"
import currency from "currency.js"
import { PAGE_SEARCH } from "./pages"

const defaultFormatPriceOptions = {
  pattern: `# !`,
  separator: ` `,
  decimal: `,`,
  symbol: `€`,
  formatWithSymbol: true,
}

export function formatPrice(price, options) {
  if (typeof price !== "number") {
    return
  }

  return currency(
    price,
    Object.assign(defaultFormatPriceOptions, options)
  ).format()
}

export const getSortingLabel = (sorting) => {
  if (!sorting || !sorting.field) {
    return ""
  }

  const ascLabel = "ascending"
  const descLabel = "descending"

  const label =
    sorting.order && (sorting.order === "desc" ? descLabel : ascLabel)
  return label ? `${sorting.field} ${label}` : sorting.field
}

export const formatDate = (date, format = `DD-MM-YYYY HH:mm:ss`) =>
  dayjs(date).format(format)

export const getSearchPageUrl = (searchTerm) =>
  `${PAGE_SEARCH}?query=${searchTerm}`
