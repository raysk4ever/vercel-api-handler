/* eslint-disable node/no-unsupported-features/es-syntax */
import * as core from '@actions/core'
import getDeploymentUrl from './vercel.js'

async function run() {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    console.info(process.env)
    const githubProject = process.env.GITHUB_REPOSITORY
    const githubBranch = process.env.GITHUB_HEAD_REF // githubRef.replace('refs/heads/', '')
    // const triggeringGithubUser = process.env.GITHUB_TRIGGERING_ACTOR
    const githubRepo = githubProject.split('/')[1]
    const tokenUsername = core.getInput('github_token_username')
    const vercelOptions = {
      projectId: core.getInput('vercel_project_id'),
      teamId: core.getInput('vercel_team_id'),
      app: core.getInput('vercel_app'),
      from: core.getInput('vercel_from'),
      limit: core.getInput('vercel_limit'),
      since: core.getInput('vercel_since'),
      state: core.getInput('vercel_state'),
      target: core.getInput('vercel_target'),
      to: core.getInput('vercel_to'),
      until: core.getInput('vercel_until'),
      users: core.getInput('vercel_users')
    }

    core.info(`Retrieving deployment preview ...`)
    console.info('vercelToken')
    console.info(vercelToken)
    const { url, state } = await getDeploymentUrl(
      vercelToken,
      githubRepo,
      githubBranch,
      vercelOptions,
      tokenUsername
    )

    core.setOutput('preview_url', url)
    core.setOutput('deployment_state', state)
  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  }
}

run()
