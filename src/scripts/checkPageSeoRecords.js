// Check existing page SEO records in database
require('dotenv').config();

const sequelize = require('../config/database');
const { SeoMetadata } = require('../models');

async function checkPageSeoRecords() {
  try {
    console.log('🔍 Checking Page SEO Records...\n');

    // Find all page metadata
    const pageRecords = await SeoMetadata.findAll({
      where: { entityType: 'page' },
      raw: true,
    });

    console.log(`📊 Total page SEO records: ${pageRecords.length}\n`);

    if (pageRecords.length === 0) {
      console.log('❌ No page SEO records found!\n');
    } else {
      console.log('📋 Page SEO Records:');
      pageRecords.forEach((record, index) => {
        console.log(`\n  [${index + 1}] ID: ${record.id}`);
        console.log(`     Entity Type: ${record.entityType}`);
        console.log(`     Entity ID: ${record.entityId}`);
        console.log(`     Page Name: ${record.pageName}`);
        console.log(`     Page Slug: ${record.pageSlug}`);
        console.log(`     Meta Title: ${record.metaTitle || '(empty)'}`);
        console.log(`     Meta Description: ${record.metaDescription || '(empty)'}`);
        console.log(`     Keywords: ${record.metaKeywords || '(empty)'}`);
        console.log(`     OG Title: ${record.ogTitle || '(empty)'}`);
        console.log(`     Created: ${record.createdAt}`);
      });
    }

    // Check specifically for terms-of-service
    console.log('\n\n🔎 Searching for /terms-of-service record...');
    const termsRecord = await SeoMetadata.findOne({
      where: {
        entityType: 'page',
      },
      raw: true,
    });

    if (!termsRecord) {
      console.log('❌ No /terms-of-service record found!\n');
    } else {
      console.log('✅ Found terms-of-service record:');
      console.log(JSON.stringify(termsRecord, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPageSeoRecords();
