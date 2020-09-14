// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { config }  from './mocks/config';

var request = require('superagent');
var superagentMock = require('superagent-mock')(request, config);

beforeAll(() => {
  superagentMock = require('superagent-mock')(request, config);
})

afterEach(() => {
})

afterAll(() => {
  superagentMock.unset();
})
