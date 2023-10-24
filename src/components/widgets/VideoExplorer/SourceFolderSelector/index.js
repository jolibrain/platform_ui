import React from "react";
import { observer } from "mobx-react";

import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

import stores from "../../../../stores/rootStore";

const SourceFolderSelector = observer(class SourceFolderSelector extends React.Component {

    constructor(props) {

        super(props);

        this.typeaheadRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    handleInputChange() {

        const { handleVideoSelection } = this.props;
        const inputRef = this.typeaheadRef.current;

        const selectedVideoPathInput = inputRef.getInput();

        handleVideoSelection(selectedVideoPathInput.value);

        inputRef.clear();
        inputRef.blur();
        inputRef.hideMenu();
    }

    render() {

        const { videoExplorerStore } = stores;

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

});

export default SourceFolderSelector
