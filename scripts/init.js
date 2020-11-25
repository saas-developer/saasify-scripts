const fs = require('fs-extra');
const os = require('os');
const spawn = require('cross-spawn');

function init(root, appName) {
  // Step 1: Copy all files from template into destination directory
  const pathToTemplate = require.resolve('saasify-template-bronze/package.json', { paths: [root] });
  console.log('pathToTemplate', pathToTemplate);

  const saasifyTemplateBronzeDirName = path.dirname(pathToTemplate);
  const saasifyTemplateBronzeTemplateDirName = path.join(saasifyTemplateBronzeDirName, 'template')
  
  if (fs.existsSync(saasifyTemplateBronzeTemplateDirName)) {
    fs.copySync(saasifyTemplateBronzeTemplateDirName, root);
  }

  // Step 2: Merge template.json and package.json

  const templateDotJson = path.join(saasifyTemplateBronzeDirName, 'template.json');
  const templateJson = require(templateDotJson);
  console.log('templateJson', templateJson);

  const packageDotJson = path.join(root, 'package.json');
  const packageJson2 = require(packageDotJson);
  console.log('packageJson2', packageJson2);

  packageJson2.scripts = Object.assign(packageJson2.scripts || {}, templateJson.scripts || {});
  packageJson2.dependencies = Object.assign(packageJson2.dependencies || {}, templateJson.dependencies || {});

  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson2, null, 2) + os.EOL
  )

  // Step 6: Run npm install in "root", "client" and "server"
  runNpmInstall(root);
  runNpmInstall(path.join(root, "client"));
  runNpmInstall(path.join(root, "server"));

}

function runNpmInstall(directory) {
  const result = spawn.sync('npm', ['install', '--save'], { stdio: 'inherit', cwd: directory });
  
  return result.status;
}

module.exports = {
  init
}
