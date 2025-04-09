/**
 * This file re-exports all types from the `registerTypes.ts` module.
 * It serves as a central hub for importing types, making the codebase cleaner and more maintainable.
 *
 * By exporting types through this index file, other parts of the application can easily import
 * all necessary types related to registration and OpenID configuration with a single import statement.
 *
 * Example usage:
 * ```
 * import { RegisterQueryParams, SuccessResponse, ErrorResponse } from 'types';
 * ```
 *
 * This eliminates the need to import from individual files in the `types` folder.
 */

export * from "./registerTypes"; // Re-export everything from registerTypes

