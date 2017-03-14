import Axios    from 'axios'
import Bluebird from 'bluebird'
import R        from 'ramda'

import Path_map from './restful-map.js'
import { getToken } from './auth.js'


const PARAMS_REGEX      = /:[a-zA-Z]*/
const INDEX_AFTER_COLON = 1


const _key_list = R.match(PARAMS_REGEX)


const _requireKeys = R.compose(R.not, R.isEmpty, _key_list)
  

const parseKeys = R.curry( (url, keys) => {
  const swapKeyWithValue = (acc, val) => R.compose(
    R.replace(val, R.__, url),
    R.prop(R.__, keys),
    (val) => val.substr(INDEX_AFTER_COLON)
  )(val)
    

  return R.reduce(swapKeyWithValue, url, _key_list(url))
})


const parseQuery = R.curry( (url, query) => {
  const query_url = url.concat('?')
  const query_list = R.toPairs(query)
  const appendQuery = (acc, val) => {
    let lastChar = acc.charAt(acc.length - 1)
    if (lastChar === '?')
      return acc.concat(val[0], '=', val[1])
    else
      return acc.concat('&', val[0], '=', val[1])
  }

  return R.reduce(appendQuery, query_url, query_list)
})


/**
 * @param {string} path - it must match the keys in urlMap
 * @param {object} keys
 * @param {obejct} query
 * @param {object} body
 * TODO: add a key checker to urlMap. If the path requires any key, and it
 * doesn't get passed, it should throw an error
 **/
const apiRequest = async ({method, path, keys, query, body}) => {
  const baseURL = 'http://127.0.0.1:3031'
  // const baseUrl      = 'http://buybuy-api.us-west-2.elasticbeanstalk.com'
  const token = await getToken()

  let _url = Path_map[path]

  if(keys) _url = parseKeys(_url)(keys)
  if(query) _url = parseQuery(_url)(query)

  const Authorization = R.ifElse(
    R.test(/^\/api\//),
    () => R.concat('Bearer ')(token),
    R.always(null)
  )(_url)

  const request = Axios.create({ headers: { Authorization }, baseURL})

  const solution = {
    get  : () => Bluebird.resolve(request.get(_url)),
    post : () => Bluebird.resolve(request.post(_url, body))
  }

  return solution[R.toLower(method)]()
}

export default apiRequest
