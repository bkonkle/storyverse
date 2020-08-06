import {paginateResponse} from '../QueryPagination'

describe('QueryPagination', () => {
  describe('paginateResponse()', () => {
    it('returns a ManyResponse object', async () => {
      const result = paginateResponse(['test'])

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 1,
        page: 1,
        pageCount: 1,
      })
    })

    it('handles page input', async () => {
      const result = paginateResponse(['test'], {page: 2})

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 1,
        page: 2,
        pageCount: 2,
      })
    })

    it('handles pageSize input', async () => {
      const result = paginateResponse(['test'], {pageSize: 10})

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 1,
        page: 1,
        pageCount: 1,
      })
    })

    it('handles total input', async () => {
      const result = paginateResponse(['test'], {total: 100})

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 100,
        page: 1,
        pageCount: 1,
      })
    })

    it('handles page & pageSize input', async () => {
      const result = paginateResponse(['test'], {page: 2, pageSize: 10})

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 11,
        page: 2,
        pageCount: 2,
      })
    })

    it('handles pageSize & total input', async () => {
      const result = paginateResponse(['test'], {pageSize: 10, total: 40})

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 40,
        page: 1,
        pageCount: 4,
      })
    })

    it('handles page, pageSize, and total input', async () => {
      const result = paginateResponse(['test'], {
        page: 2,
        pageSize: 10,
        total: 40,
      })

      expect(result).toEqual({
        data: ['test'],
        count: 1,
        total: 40,
        page: 2,
        pageCount: 4,
      })
    })
  })
})
