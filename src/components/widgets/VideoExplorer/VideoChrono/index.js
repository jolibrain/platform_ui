import React from "react";
import { inject, observer } from "mobx-react";
import { Chrono } from "react-chrono";

import Frame from './Frame'

@inject("videoExplorerStore")
@inject("deepdetectStore")
@observer
class SourceFolderSelector extends React.Component {

    constructor(props) {

        super(props)
        this.chronoRef = React.createRef();

        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        console.log(this.chronoRef)
    }

    render() {

        const { videoExplorerStore } = this.props;
        const { frames } = videoExplorerStore;

        if(frames.length === 0)
            return null;

        const { settings } = videoExplorerStore;

        let chronoItems = null;
        if(
            settings &&
                settings.chronoItemSelectors
        ) {

            const { chronoItemSelectors } = settings;
            const { showLabel, cardTitle, cardSubtitle } = chronoItemSelectors;

            chronoItems = frames.map(f => {

                const title = f.stats &&
                    f.stats[cardTitle] ?
                    `${showLabel ? cardTitle : ''} ${f.stats[cardTitle]}` : ''

                const subtitle = f.stats &&
                    f.stats[cardSubtitle] ?
                    `${showLabel ? cardSubtitle : ''} ${f.stats[cardSubtitle]}` : ''

                return {
                    cardTitle: title,
                    cardSubtitle: subtitle
                }

            })

        }

        return (
            <div className='video-chrono'>
              <input type="button" onClick={this.onClick} value="click"/>
              <Chrono
                mode={"VERTICAL"}
                items={chronoItems}
                ref={this.chronoRef}
              >
                {
                    frames
                        .filter(f => f)
                        .map(f => <Frame
                                  key={f.id}
                                  frame={f}
                                  {...this.props}
                            />
                            )

                }
              </Chrono>
            </div>
        )

    }

};

export default SourceFolderSelector
