import type { BrainEngine } from '../engine.ts';
import { sourceConfigHasRemoteUrl } from '../sources-load.ts';
import { getWorktreeBinding, managedPersistenceEnabled } from './ownership.ts';

/** Automatic jobs never request a Git mutation on a canonical managed root.
 * A clone/immutable config flag is not ownership metadata or permission to pull.
 * Explicit manual intent is deliberately resolved elsewhere and still refused
 * by managed sync unless the operator uses drained maintenance.
 */
export async function automaticSyncPull(engine: BrainEngine, source: { id: string; config: unknown }): Promise<boolean> {
  if (!sourceConfigHasRemoteUrl(source.config)) return false;
  if (await managedPersistenceEnabled(engine)) return false;
  // Claimed-but-inactive sources must not acquire implicit pull permission.
  // Leave the execution-time activation/owner refusal intact.
  return await getWorktreeBinding(engine, source.id, null) === null;
}
