// Automated rebranding script
const fs = require('fs').promises;
const path = require('path');

const rebrandingMap = {
  'DevSecOps Skill Gap Analyzer': 'SkillForge - Forge Your Tech Career',
  'DevSecOps Analyzer': 'SkillForge',
  '🛡️ DevSecOps Analyzer': '🔨 SkillForge',
  'DevSecOps Assessment': 'Tech Skills Assessment',
  'DevSecOps Engineer': 'Tech Professional',
  'DevSecOps skills': 'tech skills',
  'DevSecOps learning': 'tech learning',
  'DevSecOps career': 'tech career',
  'DevSecOps professionals': 'tech professionals',
  'DevSecOps ready': 'job ready',
  'class DevSecOpsAnalyzer': 'class SkillForge',
  'DevSecOpsAnalyzer': 'SkillForge',
  'new DevSecOpsAnalyzer': 'new SkillForge'
};

async function rebrandFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let changed = false;
    
    Object.entries(rebrandingMap).forEach(([oldText, newText]) => {
      if (content.includes(oldText)) {
        content = content.replaceAll(oldText, newText);
        changed = true;
      }
    });
    
    if (changed) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

async function rebrandDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        await rebrandDirectory(filePath);
      } else if (file.endsWith('.html') || file.endsWith('.js')) {
        await rebrandFile(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message);
  }
}

// Run rebranding
rebrandDirectory('./public').then(() => {
  console.log('🔨 SkillForge rebranding complete!');
});

module.exports = { rebrandingMap, rebrandFile, rebrandDirectory };
