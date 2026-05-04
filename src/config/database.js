// const { Sequelize } = require('sequelize');

// // Only load .env file in local development (not on Railway)
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

// console.log('🔧 Initializing Sequelize...');
// console.log('🔍 Environment:', process.env.NODE_ENV);
// console.log('🔍 Raw MYSQLHOST:', process.env.MYSQLHOST);
// console.log('🔍 Raw MYSQLUSER:', process.env.MYSQLUSER);
// console.log('🔍 Raw MYSQLDATABASE:', process.env.MYSQLDATABASE);
// console.log('🔍 Raw MYSQLPORT:', process.env.MYSQLPORT);

// // Railway MySQL provides these variables: MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT
// // For local development, use: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
// const dbConfig = {
//   host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
//   user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
//   password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
//   database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'game_app_db',
//   port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
// };

// console.log('🚨 ENV CHECK:', {
//   host: dbConfig.host,
//   user: dbConfig.user,
//   db: dbConfig.database,
//   port: dbConfig.port,
//   hasPassword: !!dbConfig.password,
// });

// let sequelize;

// try {
//   sequelize = new Sequelize(
//     dbConfig.database,
//     dbConfig.user,
//     dbConfig.password,
//     {
//       host: dbConfig.host,
//       port: dbConfig.port,
//       dialect: 'mysql',
//       logging: process.env.NODE_ENV === 'development' ? console.log : false,
//       pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//       },
//     }
//   );

//   console.log('✅ Sequelize instance created');
//   console.log('✅ Sequelize.define is available:', typeof sequelize.define === 'function');
// } catch (error) {
//   console.error('❌ Error creating Sequelize instance:', error.message);
//   process.exit(1);
// }

// // Test the database connection (non-blocking)
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('✅ Database connection established successfully');
//   })
//   .catch((err) => {
//     console.warn('⚠️  Database connection failed (will retry):', err.message);
//     console.warn('⚠️  Make sure your Railway MySQL database is configured correctly');
//   });

// module.exports = sequelize;


const { Sequelize } = require('sequelize');

require('dotenv').config();

console.log('🔧 Initializing Sequelize...');
console.log('🔍 Raw MYSQLHOST:', process.env.MYSQLHOST);
console.log('🔍 Raw MYSQLUSER:', process.env.MYSQLUSER);
console.log('🔍 Raw MYSQLDATABASE:', process.env.MYSQLDATABASE);
console.log('🔍 Raw MYSQLPORT:', process.env.MYSQLPORT);

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'game_app_db',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
};

console.log('🚨 ENV CHECK:', {
  host: dbConfig.host,
  user: dbConfig.user,
  db: dbConfig.database,
  port: dbConfig.port,
  hasPassword: !!dbConfig.password,
});

let sequelize;

try {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 60000,  // ← ADD THIS
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 60000,   // ← increase this too
        idle: 10000,
      },
    }
  );

  console.log('✅ Sequelize instance created');
  console.log('✅ Sequelize.define is available:', typeof sequelize.define === 'function');
} catch (error) {
  console.error('❌ Error creating Sequelize instance:', error.message);
  process.exit(1);
}

sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully');
  })
  .catch((err) => {
    console.warn('⚠️  Database connection failed (will retry):', err.message);
    console.warn('⚠️  Make sure your Railway MySQL database is configured correctly');
  });

module.exports = sequelize;