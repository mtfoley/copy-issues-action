const core = require('@actions/core');
const github = require('@actions/github');
const {context} = require('@actions/github/lib/utils');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const token = core.getInput('token');
    const client = github.getOctokit(token);
    // const ctx = github.context
    const {is_template, fork, template_repository} = context.repo;
    
    client.paginate(client.rest.issues.listForRepo, {
      owner: "mtfoley",
      repo: "pr-compliance-action",
    })
    .then((issues) => {
      core.debug(`Found ${issues.length} issues`);
    });

    core.debug({is_template, fork, template_repository});
    const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
