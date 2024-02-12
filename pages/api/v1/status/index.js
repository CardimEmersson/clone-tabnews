import database from 'infra/database.js';

async function status(request, response) {
  const resultDatabaseVersion = await database.query("SHOW server_version;");
  const resultDatabaseMaxConnections = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const resultDatabaseOpenedConnections = await database.query({text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;", values: [databaseName]});

  const updatedAt = new Date().toISOString();
  const version = resultDatabaseVersion.rows[0].server_version;
  const maxConnections = parseInt(resultDatabaseMaxConnections.rows[0].max_connections);
  const openedConnections = resultDatabaseOpenedConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version,
        max_connections: maxConnections,
        opened_connections: openedConnections
      }
    }
  });
}

export default status;