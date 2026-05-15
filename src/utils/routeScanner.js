const fs = require('fs');
const path = require('path');

/**
 * Scans the frontend app directory for static routes.
 * @param {string} frontendAppPath - Path to the frontend src/app directory
 * @returns {Promise<Array<{name: string, slug: string}>>}
 */
const scanFrontendPages = async (frontendAppPath) => {
  const pages = [];
  
  if (!fs.existsSync(frontendAppPath)) {
    console.warn(`Frontend app path not found: ${frontendAppPath}`);
    return pages;
  }

  const findPages = (dir, currentRoute = '') => {
    const files = fs.readdirSync(dir);

    // Check if page.tsx exists in this directory
    if (files.includes('page.tsx')) {
      // Exclude dynamic routes (containing [slug])
      if (!currentRoute.includes('[') && !currentRoute.includes(']')) {
        const route = currentRoute === '' ? '/' : currentRoute;
        
        // Skip debug and utility pages
        const skipPages = ['/debug-seo', '/seo-debug', '/category', '/game'];
        if (!skipPages.includes(route)) {
          const name = route === '/' 
            ? 'Home / Landing Page' 
            : route.substring(1)
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
          
          pages.push({ name, slug: route });
        }
      }
    }

    // Recurse into subdirectories
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory() && !file.startsWith('_') && !file.startsWith('.')) {
        findPages(fullPath, `${currentRoute}/${file}`);
      }
    }
  };

  findPages(frontendAppPath);
  return pages;
};

module.exports = { scanFrontendPages };
