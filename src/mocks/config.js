import { rest } from 'msw'

const fs = require('fs');
const ROOT_PATH = "./public/"

const jsonContent = (jsonPath) => {
    const fileContent = fs.readFileSync(ROOT_PATH + jsonPath)
    let jsonContent = {}

    try {
        jsonContent = JSON.parse(fileContent)
    } catch (e) {
        // error reading json
    }

    return jsonContent;
}

export const config = [
    {
        pattern: '.*/config.json',
        fixtures: (match, params, headers) => {
            return jsonContent("config.json")
        },
        get: function (match, data) {
            return {body: data};
        }
    },
    {
        pattern: '.*/buildInfo.json',
        fixtures: (match, params, headers) => {
            return jsonContent("buildInfo.json")
        },
        get: function (match, data) {
            return {body: data};
        }
    },
    {
        pattern: '.*/version.json',
        fixtures: (match, params, headers) => {
            return jsonContent("version.json")
        },
        get: function (match, data) {
            return {body: data};
        }
    }
]
