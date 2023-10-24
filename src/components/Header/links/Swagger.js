import React from "react";
import { observer } from "mobx-react";
import stores from "../../../stores/rootStore";

const Swagger = observer(class Swagger extends React.Component {
    render() {
        const { deepdetectStore } = stores;

        // Find first not down server
        const selectedServer = deepdetectStore.servers.find(s => !s.isDown);

        if( typeof selectedServer == "undefined" ) {
            return <></>
        } else {

            const { settings } = selectedServer
            const serverHref = `${settings.path}/swagger/ui?url=${settings.path}/api-docs/oas-3.0.0.json`

            return (
                <li id="documentation-link" className="nav-item">
                  <a
                    href={serverHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="nav-link"
                  >
                    <i className="fas fa-code" />
                    &nbsp; Swagger API
                  </a>
                </li>
            );

        }
    }
});

export default Swagger;
