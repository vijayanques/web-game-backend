// Check database structure
require('dotenv').config();
const sequelize = require('../config/database');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database structure...\n');

    // Check if table exists
    const [tables] = await sequelize.query(`
      SHOW TABLES LIKE 'seo_metadata';
    `);
    
    if (tables.length === 0) {
      console.log('❌ Table seo_metadata does not exist!');
      process.exit(1);
    }
    
    console.log('✅ Table seo_metadata exists\n');

    // Check table structure
    const [columns] = await sequelize.query(`
      DESCRIBE seo_metadata;
    `);

    console.log('📋 Table structure:');
    console.log('-------------------');
    columns.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check if required columns exist
    const columnNames = columns.map(c => c.Field);
    const requiredColumns = ['pageName', 'pageSlug', 'entityType'];
    
    console.log('\n🔍 Checking required columns:');
    requiredColumns.forEach(col => {
      if (columnNames.includes(col)) {
        console.log(`✅ ${col} exists`);
      } else {
        console.log(`❌ ${col} MISSING!`);
      }
    });

    // Check entityType enum values
    const entityTypeCol = columns.find(c => c.Field === 'entityType');
    if (entityTypeCol) {
      console.log('\n📋 entityType ENUM values:');
      console.log(entityTypeCol.Type);
      
      if (entityTypeCol.Type.includes('page')) {
        console.log('✅ "page" value exists in ENUM');
      } else {
        console.log('❌ "page" value MISSING from ENUM!');
        console.log('\n🔧 Run this SQL to fix:');
        console.log(`ALTER TABLE seo_metadata MODIFY COLUMN entityType ENUM('game', 'category', 'page') NOT NULL;`);
      }
    }

    console.log('\n✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    console.error('Error message:', error.message);
    process.exit(1);
  }
}

checkDatabase();
