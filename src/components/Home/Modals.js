import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap4-modal';

import ServiceNewModal from '../widgets/modals/ServiceNew';

@inject('modalStore')
@withRouter
@observer
export default class Modals extends React.Component {

  constructor(props) {
    super(props);

    this.modalBackdropClicked = this.modalBackdropClicked.bind(this);
  }

  modalBackdropClicked(modalName) {
    const store = this.props.modalStore;
    store.setVisible(modalName, false);
  }


  componentDidMount() {
    //this.props.commonStore.loadTags();
  }

  render() {

    const store = this.props.modalStore;

    return (
      <Modal visible={store.getModal('serviceNew').visible} onClickBackdrop={this.modalBackdropClicked.bind(this, 'serviceNew')}>
        <ServiceNewModal />
      </Modal>
    );
  }
}

