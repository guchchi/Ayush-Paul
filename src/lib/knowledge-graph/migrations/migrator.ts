import { IGraphRepository } from '../repositories/interface';
import { BaseNode, BaseEdge } from '../core/types';

export interface Migration {
  version: number;
  name: string;
  up: (repo: IGraphRepository) => Promise<void>;
  down?: (repo: IGraphRepository) => Promise<void>;
}

export class GraphMigrationSystem {
  private migrations: Migration[] = [];

  registerMigration(migration: Migration) {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  async runMigrations(repo: IGraphRepository, currentVersion: number = 0): Promise<number> {
    let appliedVersion = currentVersion;

    for (const migration of this.migrations) {
      if (migration.version > appliedVersion) {
        console.log(`Running migration v${migration.version}: ${migration.name}...`);
        await migration.up(repo);
        appliedVersion = migration.version;
      }
    }

    return appliedVersion;
  }
}
