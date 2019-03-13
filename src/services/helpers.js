export function makeComa (val, sign, isRound) {
  if (sign === '%' && (!val || val === 0 || val === null)) return ''
  if (!val || val === 0 || val === null) return '-'
  else {
    if (val.toString().indexOf('.') > -1) {
      val = isRound ? Math.round(val) : parseFloat(val).toFixed(2)
    }
    val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (sign) {
      return sign === '$' ? sign + '' + val : val + '%'
    }
    return val
  }
}
