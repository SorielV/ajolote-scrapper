import axios from 'axios'

import JSDom from '../../loaders/JSDomLoader'
import { IProxy } from '../../types'

jest.mock('axios')

describe('JSDom Loader', () => {
  describe('Load Function', () => {
    it('Load', async () => {
      const url = 'foo.com'
      const dummyHTML = '<div class="foo" id="foo"></div>'
      axios.request = jest.fn().mockResolvedValueOnce({ data: dummyHTML })
      const loader = new JSDom()

      await expect(loader.load(url)).resolves.toBeTruthy()
      expect(axios.request).toHaveBeenCalledWith({ url })
    })

    it('Including options', async () => {
      const url = 'foo.com'
      const options = { foo: 1 }
      const dummyHTML = '<div class="foo" id="foo"></div>'
      axios.request = jest.fn().mockResolvedValueOnce({ data: dummyHTML })
      const loader = new JSDom()

      await expect(loader.load(url, options)).resolves.toBeTruthy()
      expect(axios.request).toHaveBeenCalledWith({ ...options, url })
    })
  })

  describe('Proxy', () => {
    function mockProxy () {
      const proxyFunctions = {
        user: '',
        password: '',
        port: 8080,
        host: '',
        getHttpsProxyAgentWithSession: jest.fn(),
        getHttpsProxyAgent: jest.fn(),
        getCredentials: jest.fn(),
        getCredentialsWithSession: jest.fn()
      }
      const Proxy = jest.fn<IProxy, []>(() => proxyFunctions)
      return { Proxy, proxyFunctions }
    }

    it('Proxy', async () => {
      const url = 'foo.com'
      const options = { foo: 1 }
      const dummyHTML = '<div class="foo" id="foo"></div>'
      axios.request = jest.fn().mockResolvedValueOnce({ data: dummyHTML })

      const { Proxy, proxyFunctions } = mockProxy()
      const proxy = new Proxy()

      const loader = new JSDom({ proxy: true }, proxy)

      await expect(loader.load(url, options)).resolves.toBeTruthy()
      expect(proxyFunctions.getHttpsProxyAgent).toHaveBeenCalled()
      expect(axios.request).toHaveBeenCalledWith({ ...options, url })
    })

    it('Proxy With Session', async () => {
      const url = 'foo.com'
      const options = { foo: 1 }
      const dummyHTML = '<div class="foo" id="foo"></div>'
      axios.request = jest.fn().mockResolvedValueOnce({ data: dummyHTML })

      const { Proxy, proxyFunctions } = mockProxy()
      const proxy = new Proxy()

      const loader = new JSDom({ proxy: true, useRandomSession: true }, proxy)

      await expect(loader.load(url, options)).resolves.toBeTruthy()
      expect(proxyFunctions.getHttpsProxyAgentWithSession).toHaveBeenCalled()
      expect(axios.request).toHaveBeenCalledWith({ ...options, url })
    })
  })
})
