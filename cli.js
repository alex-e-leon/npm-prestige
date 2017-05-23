#!/usr/bin/env node
const chalk = require('chalk');
const prestige = require('./index');

function printDupes(dupeList) {
  const sortedList = Object.keys(dupeList).sort();

  sortedList.forEach(key => {
    console.log(chalk.bold(key));

    const sortedVersions = Object.keys(dupeList[key]).sort();

    sortedVersions.forEach(version => {
      const versionPackages = dupeList[key][version];

      if (versionPackages.length === 1) {
        console.log(`  ${chalk.bold.green(version)}: ${chalk.dim(versionPackages[0])}`);
      } else {
        console.log(`  ${chalk.bold.green(version)}:`);
        versionPackages.forEach(packagePath => {
          console.log(`    ${chalk.dim(packagePath)}`);
        });
      }
    })
  });
}

const dupeList = prestige().then(dupeList => {
  printDupes(dupeList);
});
