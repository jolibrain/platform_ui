import React from 'react';
import { render , screen, waitFor } from '@testing-library/react';

import superagentPromise from "superagent-promise";
import _superagent from "superagent";

import Description from './index'

test('render category description from regression chain result', async () => {

    const superagent = superagentPromise(_superagent, global.Promise);
    const jsonUrl = '/mocks-dd-results-regression-chain.json';
    const json = await superagent
      .get(jsonUrl)
      .then(res => res.body)

    const { container } = render(
        <Description
          imaginateStore={{
             service: {
                 selectedInput: {
                     json: json
                 }
             }
          }}
        />
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
