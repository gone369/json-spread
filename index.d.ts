declare namespace JsonSpread {
  interface Options {
    /**
     * Delimiter used for flattening nested object keys
     * @default "."
     */
    delimiter?: string;
    
    /**
     * Whether to remove empty arrays
     * @default false
     */
    removeEmptyArray?: boolean;
    
    /**
     * Replacement value for empty arrays
     * @default null
     */
    emptyValue?: any;
    
    /**
     * Whether to use safe mode
     * @default true
     */
    safe?: boolean;
    
    /**
     * Whether to enable debug mode
     * @default false
     */
    debug?: boolean;
  }

  /**
   * Spreads nested JSON or JavaScript objects into a flat structure
   * @param input Input object or array of objects
   * @param options Configuration options
   * @returns Array of flattened objects
   */
  function spread<T = any>(input: object | object[], options?: Options): T[];
}

/**
 * Spreads nested JSON or JavaScript objects into a flat structure
 * @param input Input object or array of objects
 * @param options Configuration options
 * @returns Array of flattened objects
 */
declare function jsonSpread<T = any>(input: object | object[], options?: JsonSpread.Options): T[];

declare namespace jsonSpread {
  export const spread: typeof JsonSpread.spread;
}

export default jsonSpread; 