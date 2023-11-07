const fs = require('fs').promises;
const path = require('path');

const srcDir = './src'; // Adjust this path
const outputFile = 'concatenated.txt';

const concatenateFiles = async (dir) => {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      // Check if it's a file or directory
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        const data = await fs.readFile(filePath, 'utf8');

        // Append the file content to the output file
        await fs.appendFile(outputFile, `// Content from ${filePath}\n${data}\n\n`, 'utf8');
      } else if (stats.isDirectory()) {
        // If it's a directory, look inside
        await concatenateFiles(filePath);
      }
    }
  } catch (err) {
    console.error('An error occurred:', err);
  }
};

const initializeConcatenation = async () => {
  try {
    // Clear or create the output file
    await fs.writeFile(outputFile, '', 'utf8');
    await concatenateFiles(srcDir);
  } catch (err) {
    console.error('An error occurred during initialization:', err);
  }
};

initializeConcatenation();
