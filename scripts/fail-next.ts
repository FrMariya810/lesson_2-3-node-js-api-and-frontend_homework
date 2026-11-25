import { writeFile, rm } from 'node:fs/promises'
import { failFile } from '../server/paths.ts'

if (process.argv.includes('--clear')) {
  await rm(failFile, { force: true })
  console.log('Маркер сбоя удалён.')
} else {
  await writeFile(failFile, 'fail before next write\n')
  console.log('Следующая реальная запись завершится отказом. GET не расходует маркер.')
}

