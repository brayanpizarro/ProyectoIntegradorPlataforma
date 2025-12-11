import * as path from 'path';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Si DB_HOST es 'db' (Docker), cambiar a 'localhost' para ejecución local
const dbHost = process.env.DB_HOST === 'db' ? 'localhost' : (process.env.DB_HOST || 'localhost');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'proyecto_integrador',
});

async function runMigration() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida');

    const sqlFilePath = path.join(__dirname, 'add-status-detalle-column.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

    console.log('🔄 Ejecutando migración para agregar status_detalle...');
    await AppDataSource.query(sqlContent);
    console.log('✅ Migración ejecutada exitosamente');

    await AppDataSource.destroy();
    console.log('✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

runMigration();
