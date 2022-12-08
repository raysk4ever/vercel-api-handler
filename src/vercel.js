/* eslint-disable node/no-unsupported-features/es-syntax */
import * as core from '@actions/core'
import axios from 'axios'

const apiUrl = 'https://api.vercel.com'
const deploymentsUrl = '/v6/now/deployments'

export default async function getDeploymentUrl(token, repo, branch, options, tiggerUsername) {
  let query = new URLSearchParams()
  Object.keys(options).forEach((key) => {
    if (options[key] && options[key] !== '') {
      query.append(key, options[key])
    }
  })
  core.info(`Token: ${token}`)
  core.info(`Fetching from: ${apiUrl}${deploymentsUrl}?${query.toString()}`)
  const { data } = await axios.get(
    `${apiUrl}${deploymentsUrl}?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  )
  console.info('data', data)
  let [build = { ur: '', state: 'ERROR' }] = data.deployments.filter(d => {
    if (d.creator.username === tiggerUsername && d.meta.githubCommitRef === branch) {
      return true
    }
  })
  core.debug(`Found ${data.deployments.length} deployments`)
  core.debug(`Looking for matching deployments ${repo}/${branch}`)
  // const build = data.deployments[0] ?? { url: '--', state: '--' }
  core.info(`Preview URL: https://${build.url} (${build.state})`)
  return {
    url: build.url,
    state: build.state
  }
}

// getDeploymentUrl('hOcp46XnQ4bR797FGXDt2Qco', '', 'dev', { teamId: 'team_38kTuZDxkZmIiQceGKk6vJ1G', projectId: 'QmRcLrF2N8RiYEDUBtbmKaMuvhKNqMVqxTyKo9HJ1MQwJt' })