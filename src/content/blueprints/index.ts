import type { BlueprintEngineData } from '../../types/blueprint-engine';

const blueprintModules = import.meta.glob<BlueprintEngineData>('./*.json', {
  eager: false,
  import: 'default',
});

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
