export type JsonValue = string | number | boolean | undefined | null

export type JsonArray = Array<JsonValue | JsonObject>

/**
 * A non-recursive version of JsonObject for use with react-hook-form without causing errors.
 */
export type JsonObject = Record<
  string,
  | JsonValue
  | JsonArray
  | Record<
      string,
      | JsonValue
      | JsonArray
      | Record<
          string,
          | JsonValue
          | JsonArray
          | Record<
              string,
              | JsonValue
              | JsonArray
              | Record<
                  string,
                  | JsonValue
                  | JsonArray
                  | Record<
                      string,
                      | JsonValue
                      | JsonArray
                      | Record<string, JsonValue | JsonArray>
                    >
                >
            >
        >
    >
>
