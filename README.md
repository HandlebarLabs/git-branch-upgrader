# Upgrade Git Branches

This is a script to help me update all the dependent branches for my course samples. Each lesson has a branch in the Git repo, if I update something early in the course I want to update all future branches as well so that viewing diffs between branches is useful. This is a pain when there are a lot of lessons/branches. This automates most of it (unless there is a conflict).

## Installation

- Clone repo
- cd `git-branch-upgrader`
- `npm install -g`
- `npm link` (if you want to toy around with it)

## Running

First, your project needs to have a list of branches ordered in the same way you would want it updated. This should just be a simple txt file and each branch is on its own line, like so.

```
master
lesson-1
lesson-2
lesson-3
```

You can then run the command, the only required argument is the path to the txt file with the branches listed. That will merge the current branch into the next branch.

`upgrade-branches ./branches.txt`

If you want to customize your starting branch and your finish branch you can do so via the `-s` and `-f` flags. Like so

`upgrade-branches -s master -f lesson-3 ./branches.txt`

If the merge is successfull it will continue on until it hits the final branch. After each successful merge it will push the project.

__Use at your own risk.__
