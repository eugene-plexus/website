import release from '../data/alpha-release.json';

/**
 * Whether the published release carries cache-aware balancing (conversation
 * affinity, spread, the token budget: gateway e179190, specs 49f0efb). It was
 * built after v0.1.0-alpha.6, so every alpha predates it, and the copy that
 * says it is on by default turns on when alpha-release.json moves past them.
 */
export const cacheAwareBalancingShipped = !/^v0\.1\.0-alpha\./.test(release.version);
