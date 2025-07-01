const { Pool } = require('pg');

const pool = new Pool({
  user: 'WorkForce',               // имя пользователя PostgreSQL
  host: 'localhost',               // или IP, если у тебя Docker
  database: 'mobileAppCandidates', // имя БД
  password: '19820724Gz',          // твой пароль
  port: 5433,                      // порт PostgreSQL (если ты используешь Docker, он скорее всего 5433)
});

module.exports = pool;
