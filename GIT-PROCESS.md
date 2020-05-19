# Colorado Care Exchange Git Process Guide

Our master branch is what gets deployed to production automatically.

**CAUTION** Please be careful and only push to master once QA and PRODUCT are ready for the deployment

# Branches

## Master

The master branch at origin should be familiar to every Git user. We consider origin/master to be the main branch where the source code of HEAD always reflects a production-ready state. The master branch is set to automatically deploy to production. 

## Acceptance

The acceptance branch automatically gets deployed to the acceptance environment. The product team uses this branch as a final verification to vet the next release candidate.

## Canary

The canary branch automatically gets deployed to the canary (dev) instance. This where developers push their code complete feature/bug/hotfix/feature branches. The reason for the name canary relates to the proverbial canary in the coal mine. In practice, the team member merges its project branches into the canary branch to make sure that their branches “play nice” with the rest of the team’s project branches and the product as a whole. The QA team tests each ticket against the canary branch after the developer merged their ticket branch into canary.


## Release Candidates

The release candidate branches are used by the product team to acceptance test the larger feature enhancement projects. The product team may decide that a few features should be held up until the necessary documentation has been created and communicated to the userbase. Once the materials are complete, the formal release candidate can be released to production.

Release candidate branches are first based on master. The QA team will test feature branches on the canary branch. Once these feature branches are approved by the QA team, the developer of the feature branches will merge then into the current release candidate branch. The product team will review the release candidate one the release candidate is merged into acceptance. If issues are found on the current release candidate, the product team can cancel the release candidate if the issue(s) is deemed severe or they can allow the developer to fix any issues that are discovered. Once the product team accepts the new release candidate, it will be scheduled for deployment.

The format for release candidate branches looks like this:

```
rc/1.3.0
rc/1.4.0
```

# Peer Review Process (While we are still using Gitub)
We use GitHub pull requests for peer reviews. It is expected that each project branch will require a peer review via a pull request before it is merged into the next release candidate. This helps with maintaining the quality and consistency of our codebase as well as helping team members gain (and share) knowledge and improve over time.

## Pull Request

Once a developer has gotten QA approval of a project branch and it is marked ready for Release Candidate, they create a pull request to merge that branch into the current release candidate. They can optionally request a peer review from one or more individuals or another developer will review when they notice the pending peer review. Any special notes can be added to the description of the pull request.

## Peer Review

One or more developers can perform a peer review of the pull request. They can review and approve, leave comments or request changes. This can be an iterative process. The developer might need to make adjustments before the pull request is approved. Once the pull request is approved, the peer reviewer can merge the pull request into the destination branch (typically the release candidate) if there are no code conflicts, or they leave it for the developer to resolve before merging.

### Code Conflicts

If there are code conflicts, the developer is expected to follow the command-line instructions to resolve said conflicts. Note: We never use the GitHub UI to resolve code conflicts or to make changes to source code. Also, we never resolve the code on the destination branches: canary, acceptance, etc. Those conflicts must be resolved on the project branches when possible.

====================

## Project Branches

We use different branch names to represent different types of projects. These are broken up into story, bug/hotfix, and task.

Please tag your branch names with the GitLab issue number that is on the ticket in the GitLab board. E.g. story/101-dashboard.

Bugs, Hotfixes, and Tasks can go to master when the team agrees that those branches are ready to go to production. Be thoughtful of potential downtime, pilots, demos, etc.

Before merging your project branch into canary, it is recommended that you merge or rebase master with your branch at this point. This practice can go a long way to avoiding future merge conflicts.

Once you merge your project branches into canary, be sure to ping the current QA team with a comment on the ticket so they get an email notification.

### Story

A story branch is typically a larger feature enhancement that may be held up and rolled into a formal release candidate. Story branches are based on master are created using the following naming scheme:

```
story/####
story/####-<optional-dashed-desc>
```

Once the QA team has approved the story branch, they move the ticket to Ready for Release Candidate. This signals the developer to create a PR to merge that story branch into the current release candidate branch.

### Bug/Hotfix

A bug fix or hotfix branch is based on master and uses the following naming scheme:

```
bug/####
bug/####-<optional-dashed-desc>

hotfix/####
hotfix/####-<optional-dashed-desc>
```

Bug branches get merged into canary. These should be fixed as soon as possible as they are user facing bugs that are in the current deployment. Further, they are often code fixes that devs should have in their active feature branches. Upon code completion, merge to canary and notify QA. Upon passing QA, submit a PR to master, verify deployment and notify the team so the devs can merge / rebase master into their active branch(es).

Once the bug branch is merged into canary, the developer will move the ticket into the QA column. The QA team will verify the fix in canary by testing on an canary site. Once the fix is approved, the QA team will mark the ticket as Ready for Acceptance. It is the developer’s job to keep tabs on their tickets and notice the status of each ticket as it goes through the process. Email notifications can be helpful for this. The developer should receive an email notification that the QA team has either approved their ticket or moved back to Doing (in progress).

Once the bug ticket has been approved and moved to Ready for Master it is the job of the developer to create another PR for merging into the master branch.

Hotfix branches are special bug fixes that are deemed critical. Hotfixes should be focused on above all other development and QA work. These are bugs that cause outages or prevent users from doing their work using the application.


### Task

A task branch is based on the master branch and uses the following naming scheme:

```
task/####
task/####-<optional-dashed-desc>
```

Task branches get merged into canary. Once the task branch is merged into canary, The developer will move the ticket into the QA column. The QA team will verify the change in canary by testing on the canary site. Once the task is approved, the QA team will mark the ticket as Ready for Master. It is the developer’s job to keep tabs on their tickets and notice the status of each ticket as it goes through the process. Email notifications can be helpful for this. The developer should receive an email notification that the QA team has either approved their ticket or moved back to Doing (in progress).

Once the task ticket has been approved and moved to Ready for Master it is the job of the developer to create another PR for merging into the master branch.

## CI/CD

Verify builds in the AWS CodeBuild service under the kanso-software account.

- Pushes to `canary` auto deploy to [https://canary-app.cocareexchange.org/](https://canary-app.cocareexchange.org/)
- Pushes to `acceptance` auto deploy to [https://acceptance-app.cocareexchange.org/](https://acceptance-app.cocareexchange.org/)
- Pushes to `master` auto deploy to [https://app.cocareexchange.org/](https://app.cocareexchange.org/)

<!--

commented this inital content but some of it seems more clear that what was written above

Everything
```bash
git checkout master
```
```bash
git pull
```
```bash
git checkout -b <feature-type>/<branch-name>
```
Please tag your branch names with the card number that is on the ticket in the GitLab board. E.g. feat/101-dashboard


Features / Tasks / Enhancements
Once code complete, merge to canary (It is never a bad idea to merge or rebase master with your branch at this point). At this point, move the relevant ticket to the QA column in the GitLab board. Ping the current QA team with a comment on the ticket.

QA will mark the ticket as passing or will ping you with missing requirements, issues, etc. Upon QA approving your ticket, merge / rebase your feature branch with master again at this point. Then merge your feature branch into acceptance (git pull on acceptance first). Move ticket to “Acceptance” in GitLab project board and ping Haile to run acceptance on this feature. Same process as above regarding fixes, etc. 

Upon acceptance of the feature, submit a PR for the current rc branch. Verify with the team whether or not there is a current RC branch on the git remote. If not, add one now and submit a PR for the team to review

In preparation for a feature release or a release of a group of features, verify that the rc branch successfully can run a production build. I don’t see there being any harm at this point to merge the rc branch into acceptance to do a final pass to validate the release candidate in a deployed environment. If all looks good, merge the rc branch into master, verify successful deployment and back merge master into canary and acceptance and notify the team so the devs can merge / rebase master into their active branch(es).

**At all points in time, please ensure commits are done on your feature branch and not on shared branches such as canary, master, acceptance, rcs, etc.

-->

