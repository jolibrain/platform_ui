import { rest } from 'msw'

const fs = require('fs');

const PUBLIC_PATH = "./public/"
const MOCK_PATH = "./src/mocks/json/"

const jsonContent = (jsonPath, rootPath = PUBLIC_PATH, isDebug = false) => {

    const filePath = rootPath + jsonPath;
    const fileContent = fs.readFileSync(filePath)

    let jsonContent = {}

    try {
        jsonContent = JSON.parse(fileContent)
    } catch (e) {
        if(isDebug) console.log(e);
        // error reading json
    }

    if(isDebug) console.log(jsonContent)

    return jsonContent;
}

export const config = [
    {
        pattern: '/config.json',
        fixtures: (match, params, headers) => {
            return jsonContent("config.json")
        },
        get: function (match, data) {
            return {body: data};
        }
    },
    {
        pattern: '/mocks-config.json',
        fixtures: (match, params, headers) => {
            return jsonContent("config.json", MOCK_PATH)
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
    },
    {
        pattern: '/mocks-dd-results-regression.json',
        fixtures: (match, params, headers) => {
            return jsonContent("dd-results/regression.json", MOCK_PATH)
        },
        get: function (match, data) {
            return {body: data};
        }
    },
    {
        pattern: '/mocks-dd-results-regression-chain.json',
        fixtures: (match, params, headers) => {
            return jsonContent("dd-results/regression-chain.json", MOCK_PATH)
        },
        get: function (match, data) {
            return {body: data};
        }
    },
    {
        pattern: '/mocks-dd-results-imageserv.json',
        fixtures: (match, params, headers) => {
            return jsonContent("dd-results/imageserv.json", MOCK_PATH)
        },
        get: function (match, data) {
            return {body: data};
        }
    },
]
