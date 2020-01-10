import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import TableItem from "./TableItem";

@observer
export default class Table extends React.Component {
  render() {
    const { measureKeys } = this.props;
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Timeline</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {measureKeys.map((key, index) => (
            <TableItem
              key={`tableitem-${key}`}
              measureKey={key}
              {...this.props}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  service: PropTypes.object.isRequired
};
