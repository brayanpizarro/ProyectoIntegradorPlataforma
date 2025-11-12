// scripts/create-db.ts
import { Client } from 'pg';

async function main() {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const database = process.env.POSTGRES_DB || 'proyecto_integrador';

  // Conectamos a la DB postgres default para crear la deseada
  const client = new Client({ host, port, user, password, database: 'postgres' });

  try {
    await client.connect();
    const dbName = database.replace(/"/g, '');
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos creada: ${dbName}`);
    } else {
      console.log(`ℹ️ La base de datos ya existe: ${dbName}`);
    }
  } catch (err) {
    console.error('❌ Error creando base de datos:', err);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('❌ Error inesperado:', e);
});
