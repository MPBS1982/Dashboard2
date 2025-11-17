export const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatNumber = (value: number) => value.toLocaleString('pt-BR')
export const formatPercent = (value: number) => `${value.toFixed(1)}%`
export const parseNumberBR = (input: unknown): number => {
  if (typeof input === 'number') return input
  const s = String(input ?? '').trim()
  if (!s) return 0
  const norm = s.replace(/\./g, '').replace(/,/g, '.')
  const m = norm.match(/-?\d+(?:\.\d+)?/)
  return m ? parseFloat(m[0]) : 0
}