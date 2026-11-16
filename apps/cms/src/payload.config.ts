import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildSiteConfig, siteConfigOptionsFromEnv } from '@harbour/cms-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildSiteConfig({
  ...siteConfigOptionsFromEnv('cms'),
  adminBaseDir: dirname,
})
