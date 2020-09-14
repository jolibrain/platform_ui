import { rest } from 'msw'

const fs = require('fs');

const configPath = './public/config.json';
const configFile = fs.readFileSync(configPath)

export const handlers = [
  rest.get('/config.json', (req, res, ctx) => {
    let configJson = JSON.parse(configFile)
    return res(ctx.json(configJson))
  }),
]
