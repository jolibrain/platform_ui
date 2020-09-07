import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import TableItem from "./TableItem";

@observer
class Table extends React.Component {
  render() {
    const { measureHistKeys } = this.props;
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Timeline</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {measureHistKeys.map((key, index) => (
            <TableItem
              key={`tableitem-${key}`}
              measureHistKey={key}
              {...this.props}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  measureHistKeys: PropTypes.array.isRequired
};
export default Table;
