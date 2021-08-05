const fs = require('fs')
const workspaceConfig = require('./workspace.json')

const PROCESS = process.argv[3]
const [project] = PROCESS.split(':')

const projectConfig = workspaceConfig.projects[project]

const plugins = {autoprefixer: {}}

if (projectConfig && projectConfig.projectType === 'application') {
  const config = fs.existsSync(`${projectConfig.root}/tailwind.config.js`)
    ? `./${projectConfig.root}/tailwind.config.js`
    : './tailwind.config.js'

  plugins['tailwindcss'] = {config: `${config}`}
}

module.exports = {
  plugins,
}
