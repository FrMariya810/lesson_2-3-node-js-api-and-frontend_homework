import { fileURLToPath } from 'node:url'

export const dataDir = fileURLToPath(new URL('../data/', import.meta.url))
export const dataFile = fileURLToPath(new URL('../data/loans.json', import.meta.url))
export const failFile = fileURLToPath(new URL('../data/.fail-next-write', import.meta.url))

