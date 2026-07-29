import { registry } from '../../../../lib/rendering/Registry';
import { ExecutiveSummaryBlock } from '../blocks/ExecutiveSummaryBlock';
import { StrategicPillarBlock } from '../blocks/StrategicPillarBlock';
import { ActionItemBlock } from '../blocks/ActionItemBlock';

/**
 * Registers all Authority Pack blocks into the central RendererRegistry.
 * Call this during app initialization.
 */
export function registerAuthorityPackBlocks() {
  registry.register('authority-pack.executive-summary', ExecutiveSummaryBlock);
  registry.register('authority-pack.strategic-pillar', StrategicPillarBlock);
  registry.register('authority-pack.action-item', ActionItemBlock);
}
