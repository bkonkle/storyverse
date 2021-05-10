import * as z from 'zod'

type JsonLiteral = string | number | boolean | null

type WithLiterals<T> =
  | JsonLiteral
  | T
  | Array<JsonLiteral | T>
  | Array<Array<JsonLiteral | T>>

type JsonObject = {
  [Key in string]?: WithLiterals<
    {
      [Key in string]?: WithLiterals<
        {
          [Key in string]?: WithLiterals<
            {
              [Key in string]?: WithLiterals<
                {
                  [Key in string]?: WithLiterals<null>
                }
              >
            }
          >
        }
      >
    }
  >
}

/**
 * Workaround for "Type instantiation is excessively deep and possibly infinite" issues with
 * `react-hook-form`. Matches Prisma's JsonObject but only represents 5 levels of nesting. Casting
 * is necessary to unify with infinitely recursive types like Prisma's.
 */
export type JsonValue = WithLiterals<JsonObject>

const literal = () => z.union([z.string(), z.number(), z.boolean(), z.null()])

/**
 * An infinitely recursive validator that reflects a limited recursion type to work around "Type
 * instantiation is excessively deep and possibly infinite" issues with `react-hook-form`.
 */
export const json = (): z.ZodSchema<JsonValue> =>
  z.lazy(() =>
    z.union([literal(), z.array(json()), z.record(json())])
  ) as z.ZodSchema<JsonValue>
