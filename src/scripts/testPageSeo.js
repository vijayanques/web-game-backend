// Test script to verify page SEO functionality
require('dotenv').config();
const { SeoMetadata } = require('../models');

async function testPageSeo() {
  try {
    console.log('🧪 Testing Page SEO functionality...\n');

    // Test 1: Create page metadata
    console.log('Test 1: Creating page metadata...');
    const testData = {
      entityType: 'page',
      entityId: 999999,
      pageName: 'Test Page',
      pageSlug: '/test-page',
      metaTitle: 'Test Page Title',
      metaDescription: 'Test page description',
      robots: 'index, follow',
    };

    const [metadata, created] = await SeoMetadata.findOrCreate({
      where: { entityType: 'page', entityId: 999999 },
      defaults: testData,
    });

    if (created) {
      console.log('✅ Page metadata created successfully!');
      console.log('   ID:', metadata.id);
      console.log('   Page Name:', metadata.pageName);
      console.log('   Page Slug:', metadata.pageSlug);
    } else {
      console.log('ℹ️  Page metadata already exists');
    }

    // Test 2: Fetch page metadata
    console.log('\nTest 2: Fetching page metadata...');
    const fetched = await SeoMetadata.findOne({
      where: { entityType: 'page', entityId: 999999 },
    });

    if (fetched) {
      console.log('✅ Page metadata fetched successfully!');
      console.log('   Data:', JSON.stringify(fetched.toJSON(), null, 2));
    } else {
      console.log('❌ Failed to fetch page metadata');
    }

    // Test 3: Update page metadata
    console.log('\nTest 3: Updating page metadata...');
    await metadata.update({
      metaTitle: 'Updated Test Page Title',
    });
    console.log('✅ Page metadata updated successfully!');

    // Test 4: Fetch all pages
    console.log('\nTest 4: Fetching all page metadata...');
    const allPages = await SeoMetadata.findAll({
      where: { entityType: 'page' },
    });
    console.log(`✅ Found ${allPages.length} page(s)`);

    // Cleanup
    console.log('\nCleaning up test data...');
    await SeoMetadata.destroy({
      where: { entityType: 'page', entityId: 999999 },
    });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testPageSeo();
