import React from 'react';
import { render , screen, waitFor } from '@testing-library/react';

import superagentPromise from "superagent-promise";
import _superagent from "superagent";

import Category from './index'

test('render predict description', async () => {
    const superagent = superagentPromise(_superagent, global.Promise);
    const jsonUrl = '/mocks-dd-results-imageserv.json';
    const json = await superagent
      .get(jsonUrl)
      .then(res => res.body)

    const { container } = render(
        <Category input={{json: json}} imaginateStore={null}/>
    )

    const descriptionElement = container.getElementsByClassName('description-category')[0];
    expect(descriptionElement).toBeInTheDocument();

    const badgeElement = descriptionElement.getElementsByClassName('badge')[0];
    expect(badgeElement).toBeInTheDocument();

    expect(badgeElement.textContent)
        .toBe(json.body.predictions[0].classes[0].cat)
    expect(badgeElement.dataset.tip)
        .toBe(json.body.predictions[0].classes[0].prob.toFixed(2))
})

test('render vector description', async () => {

    const superagent = superagentPromise(_superagent, global.Promise);
    const jsonUrl = '/mocks-dd-results-regression.json';
    const json = await superagent
      .get(jsonUrl)
      .then(res => res.body)

    const { container } = render(
        <Category input={{json: json}} imaginateStore={null}/>
    )

    const descriptionElement = container.getElementsByClassName('description-category')[0];
    expect(descriptionElement).toBeInTheDocument();

    const badgeElement = descriptionElement.getElementsByClassName('badge')[0];
    expect(badgeElement).toBeInTheDocument();

    // For regression services, containing vector array in prediction results,
    // displayed value should be prediction val with category as tooltip
    expect(badgeElement.dataset.tip)
        .toBe(json.body.predictions[0].vector[0].cat)
    expect(badgeElement.textContent)
        .toBe(json.body.predictions[0].vector[0].val.toFixed(2))
})

test('render vector description from chain result', async () => {

    const superagent = superagentPromise(_superagent, global.Promise);
    const jsonUrl = '/mocks-dd-results-regression-chain.json';
    const json = await superagent
      .get(jsonUrl)
      .then(res => res.body)

    const { container } = render(
        <Category input={{json: json}} imaginateStore={null}/>
    )

    const descriptionElement = container.getElementsByClassName('description-category')[0];
    expect(descriptionElement).toBeInTheDocument();

    const badgeElement = descriptionElement.getElementsByClassName('badge')[0];
    expect(badgeElement).toBeInTheDocument();

    const regression_service = json.body.predictions[0].classes[0].regression_service;

    // For regression services, containing vector array in prediction results,
    // displayed value should be prediction val with category as tooltip
    expect(badgeElement.dataset.tip)
        .toBe(regression_service.vector[0].cat)
    expect(badgeElement.textContent)
        .toBe(regression_service.vector[0].val.toFixed(2))
})
