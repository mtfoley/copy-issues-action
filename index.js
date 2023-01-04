const core = require('@actions/core');
const github = require('@actions/github');
const {context} = require('@actions/github/lib/utils');

const getOwnerAndName = (full_name) => {
  if(full_name === "" || full_name.indexOf("/") === -1){
    return null;
  }
  const [owner, repo] = full_name.split("/");
  return {owner, repo};
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const token = core.getInput('token');
    let source_repo = core.getInput('source_repo');
    const client = github.getOctokit(token);
    
    const {data: {full_name: target_repo, parent, template_repository}} = await client.rest.repos.get(context.repo);
    if(source_repo === ""){
      if(parent){
        core.debug(`${target_repo} is a fork of ${parent.full_name}.`);
        source_repo = parent.full_name;
      } else if(template_repository){
        core.debug(`${target_repo} was generated from template ${template_repository.full_name}.`);
        source_repo = template_repository.full_name;
      } else {
        throw new Error(`${target_repo} is neither a fork nor generated from a template. Input "source_repo" must be supplied.`);
      }
    }
    core.debug(`Copying issues from ${source_repo}`);
    client.paginate(client.rest.issues.listForRepo, {
      ...getOwnerAndName(source_repo),
      state: "open"
    })
    .then((issuesOrPulls) => {
      const issues = issuesOrPulls.filter((item) => {
        return !item.pull_request;
      }).map(({title, body, labels}) => {
        return {title, body, labels};
      })
      core.debug(`(${issues.length}) issues found.`);
      return issues;
    })
    .then((issues) => {
      issues.forEach(async ({title, body, labels}) => {
        core.debug(`Copying issue with title ${title}`);
        await client.rest.issues.create({
          ...getOwnerAndName(target_repo),
          title,
          body,
          labels
        });
      });
    })
    .catch((error) => {
      core.setFailed(error);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
