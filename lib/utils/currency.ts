const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatCurrencyIDR(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return idrFormatter.format(0);
  }

  return idrFormatter.format(value);
}
