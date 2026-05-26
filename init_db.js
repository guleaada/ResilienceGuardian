const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sebilai.db');

db.serialize(() => {
  console.log("🚀 Initializing SebilAI Database...");
  db.run("PRAGMA foreign_keys = ON;");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'agronomist')) DEFAULT 'agronomist',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      local_names TEXT,
      scientific_name TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS diseases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_id INTEGER,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('Disease', 'Pest')),
      pathogen TEXT,
      symptoms TEXT,
      severity TEXT,
      management_cultural TEXT,
      management_biological TEXT,
      management_chemical TEXT,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (crop_id) REFERENCES crops(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS diagnoses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id TEXT DEFAULT 'anonymous',
      crop_id INTEGER NOT NULL,
      disease_id INTEGER,
      disease_name TEXT,
      severity TEXT,
      confidence REAL,
      photo_url TEXT,
      latitude REAL,
      longitude REAL,
      region TEXT,
      notes TEXT,
      impact_etb INTEGER DEFAULT 0,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (crop_id) REFERENCES crops(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stats_cache (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      total_diagnoses INTEGER DEFAULT 0,
      total_impact_etb INTEGER DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`INSERT OR IGNORE INTO stats_cache (id) VALUES (1)`);
  console.log("✅ Database schema initialized successfully!");
});

db.close();
