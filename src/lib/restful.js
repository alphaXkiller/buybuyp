import Axios    from 'axios'
import Bluebird from 'bluebird'
import R        from 'ramda'

import Path_map from './restful-map.js'
import { getToken } from './auth.js'


const PARAMS_REGEX      = /:[a-zA-Z]*/
const INDEX_AFTER_COLON = 1
// const baseURL        = 'http://127.0.0.1:3031'
const baseURL           = 'http://buybuy-api.us-west-2.elasticbeanstalk.com'


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
  //remove undefined field in query
  const query_list = R.toPairs(JSON.parse(JSON.stringify(query)))
  const appendQuery = (acc, val) => {
    let lastChar = acc.charAt(acc.length - 1)
    if (lastChar === '?')
      return acc.concat(val[0], '=', val[1])
    else
      return acc.concat('&', val[0], '=', val[1])
  }

  return R.reduce(appendQuery, query_url, query_list)
})


const solution = (instance, url, body) => ({
  get  : () => Bluebird.resolve(instance.get(url)),
  post : () => Bluebird.resolve(instance.post(url, body))
})

/**
 * @param {string} path - it must match the keys in urlMap
 * @param {object} keys
 * @param {obejct} query
 * @param {object} body
 * TODO: add a key checker to urlMap. If the path requires any key, and it
 * doesn't get passed, it should throw an error
 **/
const apiRequest = ({method, path, keys, query, body}) => {

  const _query = R.when(notNilOrEmpty, R.filter(notNilOrEmpty))(query)
  let _url     = Path_map[path]

  if (R.isNil(_url)) throw new Error('WRONG PATH')

  if (keys) _url = parseKeys(_url)(keys)
  if (_query) _url = parseQuery(_url)(_query)

  // TODO: SUPPOSE TO USE ASYNC/AWAIT, BUT BROWSER SUPPORT IS SO POOR
  if (R.test(/^\/api\//)(_url)) {
    return getToken()
      
      .then( token => {
        const Authorization = R.concat('Bearer ')(token)
        const request = Axios.create({ headers: { Authorization }, baseURL })

        return solution(request, _url, body)[method]()
      })
  } else {
    const request = Axios.create({baseURL})
    return solution(request, _url, body)[method]()
  }
}

export default apiRequest
