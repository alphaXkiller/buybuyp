import R from 'ramda'
import Qs from 'qs'

const stringifyUrl = (base_path, query) => R.compose(
  R.concat(base_path + '?'),
  Qs.stringify,
  R.filter(R.complement(R.isNil))
)(query)


export {
  stringifyUrl
}
