import pool from "./config/db";

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("🟢 DB Time:", result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("🔴 DB Connection Failed:", error);
    process.exit(1);
  }
}

testDB();
