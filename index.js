// node ./.scripts/update-branches.js
const exec = require('child_process').exec;

/*
 * 1. Path to the list of branches (capture from process.argv)
 * 2. Get current branch (git rev-parse --abbrev-ref HEAD)
 * 3. Branch to stop at (default at next branch index, capture from process.argv)
 * 4. Merge, commit, push, repeat for next branch until at final branch from step 3
 *    - If merge fail, throw & stop
 */

const getCurrentBranch = () => {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      } else {
        resolve(stdout.replace(/ /g, ''));
      }
    });
  });
};

const checkoutBranch = branch => {
  return new Promise((resolve, reject) => {
    exec(`git checkout ${branch}`, (error, stdout, stderr) => {
      if (error !== null) {
        reject(error);
      } else {
        resolve(stdout.replace(/ /g, ''));
      }
    });
  });
};

const doTheThing = async () => {
  try {
    const currentBranch = await getCurrentBranch(); // is there a bunch of whitespace around this?
    const pathToBranchesArray = process.argv[2];
    const branchToStopMergingAt = process.argv[3];

    if (!currentBranch || !pathToBranchesArray || !branchToStopMergingAt) {
      throw new Error('pass the params, fam');
    }

    // TODO: Check that we can load an array in from pathToBranchesArray
    // TODO: Check that the current branch is in the branchesArray
    // TODO: Check that branchToStopMergingAt is a branch & the index is greater than the current

    // TODO: Checkout next branch
    // TODO: merge previous branch
    // TODO: Push branch
    // TODO: Repeat until at the "branchToStopMergingAt" OR and error is thrown (like merge conflict)
    // TODO: Track some stats & log it
  } catch (e) {
    console.warn('ahhh shiiit', e);
  }
};

doTheThing();
