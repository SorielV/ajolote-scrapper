import querystring from 'querystring'

export const append = (url: string, query: any, replace: boolean = true): string => {
  if (!replace || !url.includes('?')) {
    return `${url}${url.includes('?') ? '&' : '?'}${querystring.encode(query)}`
  }
  const [_url, _urlQuery] = url.split('?')
  const _query = querystring.decode(_urlQuery)
  return append(_url, { ..._query, ...query })
}
