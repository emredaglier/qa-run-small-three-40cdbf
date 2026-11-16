import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`breads_days\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`breads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`breads_days_order_idx\` ON \`breads_days\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`breads_days_parent_idx\` ON \`breads_days\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`breads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`breads__order_idx\` ON \`breads\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`breads_updated_at_idx\` ON \`breads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`breads_created_at_idx\` ON \`breads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`opening_hours_week\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`day\` text NOT NULL,
  	\`closed\` integer DEFAULT false,
  	\`opens\` text,
  	\`closes\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`opening_hours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`opening_hours_week_order_idx\` ON \`opening_hours_week\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`opening_hours_week_parent_id_idx\` ON \`opening_hours_week\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`opening_hours\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`address\` text,
  	\`map_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`breads_id\` integer REFERENCES breads(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_breads_id_idx\` ON \`payload_locked_documents_rels\` (\`breads_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`breads_days\`;`)
  await db.run(sql`DROP TABLE \`breads\`;`)
  await db.run(sql`DROP TABLE \`opening_hours_week\`;`)
  await db.run(sql`DROP TABLE \`opening_hours\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id") SELECT "id", "order", "parent_id", "path", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
}
