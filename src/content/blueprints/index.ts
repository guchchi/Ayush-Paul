import type { BlueprintEngineData } from '../../types/blueprint-engine';
import getYourFirst3Clients from './get-your-first-3-clients.json';
import growthOs from './growth-os.json';
import bCyberOs from './b-cyber-os.json';

const blueprintModules: Record<string, () => Promise<BlueprintEngineData>> = {
  './get-your-first-3-clients.json': () => Promise.resolve(getYourFirst3Clients as BlueprintEngineData),
  './growth-os.json': () => Promise.resolve(growthOs as BlueprintEngineData),
  './b-cyber-os.json': () => Promise.resolve(bCyberOs as BlueprintEngineData),
};

export const blueprintEngineSlugs: string[] = Object.keys(blueprintModules).map((path) =>
  path.replace('./', '').replace('.json', ''),
);

export function hasEngineContent(slug: string): boolean {
  return blueprintEngineSlugs.includes(slug);
}

export async function getBlueprint(slug: string): Promise<BlueprintEngineData | undefined> {
  const path = `./${slug}.json`;
  const importer = blueprintModules[path];
  if (!importer) return undefined;
  try {
    return await importer();
  } catch {
    return undefined;
  }
}

export async function getAllBlueprints(): Promise<BlueprintEngineData[]> {
  const results = await Promise.all(
    blueprintEngineSlugs.map((slug) => getBlueprint(slug)),
  );
  return results.filter((b): b is BlueprintEngineData => b !== undefined);
}

