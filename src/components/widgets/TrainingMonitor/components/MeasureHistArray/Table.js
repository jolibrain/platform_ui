import React from "react";

import TableItem from "./TableItem";

const Table = class Table extends React.Component {
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
};
export default Table;
