import React from "react";
import { inject, observer } from "mobx-react";

import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

@inject("videoExplorerStore")
@inject("deepdetectStore")
@observer
class SourceFolderSelector extends React.Component {

    constructor(props) {

        super(props);

        this.typeaheadRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    handleInputChange() {

        const { videoExplorerStore } = this.props;
        const selectedVideoPathInput = this.typeaheadRef.current.getInput();

        videoExplorerStore.setVideoPath(selectedVideoPathInput.value);
        this.typeaheadRef.current.clear();
    }

    render() {

        const { videoExplorerStore } = this.props;

        return <div className="source-folder-selector">
            <Typeahead
                 id="inlineFormInputVideoPath"
                 ref={this.typeaheadRef}
                 options={videoExplorerStore.videoPaths}
                 labelKey={"name"}
                 placeholder="Select processed video folder"
                 onChange={this.handleInputChange}
               />
        </div>

    }

};

export default SourceFolderSelector
