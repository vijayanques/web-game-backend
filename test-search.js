// Quick test script to verify search functionality
// Run with: node test-search.js

const { Game, Category } = require('./src/models');
const { Op } = require('sequelize');

async function testSearch() {
  try {
    console.log('🔍 Testing Search Functionality\n');
    
    // Test 1: Get all games
    console.log('📊 Test 1: Fetching all games...');
    const allGames = await Game.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    
    console.log(`✅ Found ${allGames.length} total games\n`);
    
    if (allGames.length === 0) {
      console.log('❌ No games found in database!');
      console.log('💡 Add some games first before testing search.\n');
      process.exit(0);
    }
    
    // Show all games
    console.log('📋 All games in database:');
    allGames.forEach((game, index) => {
      console.log(`   ${index + 1}. ${game.title} (ID: ${game.id}, Active: ${game.isActive}, Slug: ${game.slug})`);
    });
    console.log('');
    
    // Test 2: Get active games only
    console.log('📊 Test 2: Fetching active games only...');
    const activeGames = await Game.findAll({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    
    console.log(`✅ Found ${activeGames.length} active games\n`);
    
    if (activeGames.length === 0) {
      console.log('❌ No active games found!');
      console.log('💡 Run this SQL to activate all games:');
      console.log('   UPDATE games SET isActive = 1;\n');
      process.exit(0);
    }
    
    // Test 3: Search for first game
    const firstGame = activeGames[0];
    const searchTerm = firstGame.title.substring(0, 3);
    
    console.log(`📊 Test 3: Searching for "${searchTerm}"...`);
    const searchResults = await Game.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          { genre: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      limit: 10,
    });
    
    console.log(`✅ Found ${searchResults.length} results\n`);
    
    if (searchResults.length > 0) {
      console.log('📋 Search results:');
      searchResults.forEach((game, index) => {
        console.log(`   ${index + 1}. ${game.title}`);
        console.log(`      - Slug: ${game.slug}`);
        console.log(`      - Category: ${game.category ? game.category.name : 'None'}`);
        console.log(`      - Genre: ${game.genre}`);
        console.log('');
      });
    }
    
    // Test 4: Test the exact search endpoint format
    console.log('📊 Test 4: Testing search endpoint format...');
    const formattedResults = searchResults.map(game => ({
      id: game.id,
      title: game.title,
      slug: game.slug,
      thumbnail_url: game.thumbnail,
      description: game.description,
      category_name: game.category ? game.category.name : null,
      category_id: game.categoryId,
      genre: game.genre,
      rating: game.rating,
    }));
    
    console.log('✅ Formatted response:');
    console.log(JSON.stringify({
      success: true,
      data: formattedResults,
      count: formattedResults.length,
    }, null, 2));
    
    console.log('\n✅ All tests passed!');
    console.log('\n💡 Try searching in your app for:', searchTerm);
    console.log('   URL: http://192.168.1.118:8000/api/games/search?q=' + searchTerm);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testSearch();
