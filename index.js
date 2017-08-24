#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');
const child_process = require('child_process');

const readFile = Promise.promisify(fs.readFile);
const exec = Promise.promisify(child_process.exec);

const getArrayOfBranches = async (path) => {
  const data = await readFile(path, { encoding: 'utf8' });
  return _.without(data.split('\n'), '');
};

const getCurrentBranch = async () => {
  const branch = await exec('git rev-parse --abbrev-ref HEAD');
  return _.trim(branch);
};

const indexOfBranch = (branches, branch) => _.indexOf(branches, branch);

const mergePreviousBranch = async (currentBranch, nextBranch) => {
  await exec(`git checkout ${currentBranch}`);
  await exec(`git checkout ${nextBranch}`);
  await exec(`git merge ${currentBranch}`); // Merge conflict should just throw
  await exec(`git push`);

  return true;
};

const doTheThings = async (pathToBranches, options) => {
  try {
    const branches = await getArrayOfBranches(pathToBranches);

    const startBranch = options.startBranch ? options.startBranch : await getCurrentBranch();
    const indexOfStartBranch = indexOfBranch(branches, startBranch);
    if (indexOfStartBranch === -1) throw new Error('Specified start branch is not valid');

    const finishBranch = options.finishBranch ? options.finishBranch : branches[indexOfStartBranch + 1];
    const indexOfFinishBranch = indexOfBranch(branches, finishBranch);
    if (indexOfFinishBranch === -1) throw new Error('Specified finish branch is not valid');

    let i = indexOfStartBranch;
    while (i < indexOfFinishBranch) {
      await mergePreviousBranch(branches[i], branches[i + 1]);
      i++;
    }
  } catch (e) {
    console.log('Something went wrong...', e);
  }
};

program
  .arguments('<pathToBranches>')
  .option('-s, --start <startBranch>', 'The branch to start at')
  .option('-f, --finish <finishBranch>', 'The branch to finish at')
  .action((pathToBranches) => {
    doTheThings(pathToBranches, { startBranch: program.start, finishBranch: program.finish });
  })
  .parse(process.argv);
