/**
 * config/db.js
 *
 * Lightweight JSON-file "database" layer.
 * Provides read/write helpers around database/db.json using fs/promises.
 *
 * Structure of db.json:
 * {
 *   "students": [ { id, name, email, course, age }, ... ],
 *   "nextId": <number>
 * }
 */

const fs = require("fs/promises");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "database", "db.json");

/**
 * Ensures the database file exists. If it does not, creates it with a
 * default structure so the API never crashes on a missing file.
 */
async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch (err) {
    const defaultData = { students: [], nextId: 1 };
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

/**
 * Reads and parses the entire database file.
 * @returns {Promise<{students: Array, nextId: number}>}
 */
async function readDB() {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");

  try {
    return JSON.parse(raw);
  } catch (err) {
    // If the file is corrupted/empty, reset it safely instead of crashing.
    const defaultData = { students: [], nextId: 1 };
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
}

/**
 * Writes the given data object back to the database file.
 * @param {{students: Array, nextId: number}} data
 */
async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readDB,
  writeDB,
};
