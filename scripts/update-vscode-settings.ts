import path from 'path'
import fs from 'fs'
import { formatFileByPrettier } from './helpers'
import jsoncParser from 'jsonc-parser'
import {
  filter,
  flatMap,
  isTruthy,
  map,
  mergeAll,
  mergeDeep,
  pipe,
} from 'remeda'
import prettier from 'prettier'

const workspaceDirname = path.join(
  // TODO: use import.meta.dirname when it's available
  new URL('.', import.meta.url).pathname,
  '../.vscode',
)
const settingsFilename = path.join(workspaceDirname, 'settings.json')

function getCurrentSettings() {
  if (!fs.existsSync(settingsFilename)) {
    return {}
  }

  const settings = fs.readFileSync(settingsFilename, 'utf-8')

  return jsoncParser.parse(settings)
}

async function generatePrettierSettings() {
  const supportInfo = await prettier.getSupportInfo()

  const languagesSettings = pipe(
    supportInfo.languages,
    flatMap((languages) => languages.vscodeLanguageIds),
    filter(isTruthy),
    map((languageId) => {
      return {
        [`[${languageId}]`]: {
          'editor.defaultFormatter': 'esbenp.prettier-vscode',
          'editor.formatOnSave': true,
        },
      }
    }),
    mergeAll,
  )

  return { 'prettier.enable': true, ...languagesSettings }
}

async function updateVSCodeSettings() {
  if (!fs.existsSync(workspaceDirname)) {
    fs.mkdirSync(workspaceDirname)
  }

  const currentSettings = getCurrentSettings()
  const prettierSettings = await generatePrettierSettings()
  const settings = pipe(currentSettings, mergeDeep(prettierSettings))

  fs.writeFileSync(settingsFilename, JSON.stringify(settings, null, 2))
  await formatFileByPrettier(settingsFilename)
}

updateVSCodeSettings()
