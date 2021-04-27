/**
 * Dependency Injection Uitilities
 */

import * as fs from 'fs'
import {ClassProvider, InjectionToken} from 'tsyringe'
import {Class} from 'type-fest'

/**
 * NodeJS.ProcessEnv
 */

export const ProcessEnv: InjectionToken<NodeJS.ProcessEnv> = 'NODE_PROCESS_ENV'

/**
 * Node 'fs'
 */

export const NodeFS: InjectionToken<typeof fs> = 'NODE_FILE_SYSTEM'

/**
 * Provide a particular class in a Registry.
 */
export const useClass = <T>(
  resolversClass: Class<T>
): ClassProvider<T> & {token: InjectionToken<T>} => ({
  token: resolversClass,
  useClass: resolversClass,
})

/**
 * A semantic alias for using a module registry class, which automatically registers a set of
 * dependencies.
 */
export const useRegistry = <T>(resolversClass: Class<T>) =>
  useClass(resolversClass)
