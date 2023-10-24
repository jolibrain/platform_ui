import React from "react";
import { observer } from "mobx-react";

const ListUrl = observer(class ListUrl extends React.Component {
  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    if (!classes) return null;

    return (
      <div className="description-list-url">
        {classes.map((category, index) => {
          return (
            <div className="predictDisplay" key={index}>
              <img src={category.uri} alt="category" />
              {category.dist}
            </div>
          );
        })}
      </div>
    );
  }
});
export default ListUrl;
