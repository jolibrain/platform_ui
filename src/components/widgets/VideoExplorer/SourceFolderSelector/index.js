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
        const inputRef = this.typeaheadRef.current;

        const selectedVideoPathInput = inputRef.getInput();

        videoExplorerStore.setVideoPath(selectedVideoPathInput.value);

        inputRef.clear();
        inputRef.hideMenu();
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
