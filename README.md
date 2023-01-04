# copy-issues-action

This GitHub action copies issues from a source repo to the repo it runs in.
The source repo is determined like this:
| Context Repo | input `source_repo` provided | Source Repo |
|---|---|---|
| Fork of repo `upstream` | no | `upstream` |
| Generated from `template` | no | `template` |
| anything | yes | `source_repo` |


**Note** The action will fail if the context repo is not a fork or generated from a template,
and a `source_repo` input is not supplied.

## Usage

You can use syntax like this in a workflow file, e.g. `.github/workflows/copy-issues.yml` :rocket:

```yaml
name: Copy Issues From Upstream
on:
  # You can run this workflow from the Actions Tab
  workflow_dispatch:
jobs:
  copy-issues:
    runs-on: ubuntu-latest
    steps:
    - uses: mtfoley/copy-issue-action@main
      with:
        # You don't need this input if your repo
        # is a fork or generated from a template.
        source_repo: mtfoley/copy-issues-from-here
```
