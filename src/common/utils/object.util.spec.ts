import { ObjectUtil } from '@/common/utils/object.util'

describe('ObjectUtil', () => {
  describe('parseDotNotation', function () {

    it('should parse', function () {
      const result = ObjectUtil.parseDotNotation({
        'a.b.c.d': 10,
        'a.d': 10,
      })

      const expected = {
        a: {
          b: {
            c: {
              d: 10,
            },
          },
          d: 10
        },
      }
      expect(result).toStrictEqual(expected)
    })
  })
})