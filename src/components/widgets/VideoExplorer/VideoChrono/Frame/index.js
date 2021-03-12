import React from "react";

class Frame extends React.Component {

    render() {

        const { frame, onFrameClick } = this.props;

        return (
            <div
              onClick={onFrameClick.bind(this, frame.id)}
            >
              <img
                src={frame.imageSrc.thumb}
                alt={frame.imageAlt}
                className="img-fluid"
                loading="lazy"
              />
            </div>
        );
    }
};

export default Frame
