import fs from 'fs'
import prettier from 'prettier'

export async function formatFileByPrettier(filename: string) {
  if (!fs.existsSync(filename)) {
    throw new Error(`File not found: ${filename}`)
  }

  const sourceCode = fs.readFileSync(filename, 'utf-8')
  const options = await prettier.resolveConfig(filename)
  const formattedCode = await prettier.format(sourceCode, options ?? undefined)

  fs.writeFileSync(filename, formattedCode)
}
