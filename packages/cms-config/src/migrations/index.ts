import * as migration_20261109_152213_initial from './20261109_152213_initial';
import * as migration_20261116_125604_breads_opening_hours from './20261116_125604_breads_opening_hours';

export const migrations = [
  {
    up: migration_20261109_152213_initial.up,
    down: migration_20261109_152213_initial.down,
    name: '20261109_152213_initial',
  },
  {
    up: migration_20261116_125604_breads_opening_hours.up,
    down: migration_20261116_125604_breads_opening_hours.down,
    name: '20261116_125604_breads_opening_hours'
  },
];
