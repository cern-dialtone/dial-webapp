import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { actionMessage, logMessage } from 'common/utils/logs';

/**
 * Button that displays the connection status
 * @param color (string) Color of the button
 * @param message
 * @param onClick
 * @returns {*}
 * @constructor
 */
const ConnectionIcon = ({ color, message, onClick }) => (
  <Button onClick={onClick} as="a" className="flat" title={message}>
    <Icon name="circle" color={color} />
  </Button>
);

ConnectionIcon.propTypes = {
  color: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

function getUiProperties(connected, activeNumber, doNotDisturb) {
  let color;
  let message;
  let callsMessage;
  if (connected) {
    message = `You are connected with number ${activeNumber}`;
    callsMessage = `You are able to make and receive calls`;
  } else {
    message = 'You are not connected to the telephony backend';
    callsMessage = `You won't be able to make or receive calls until you connect with a phone number of your choice`;
  }

  if (doNotDisturb) {
    color = 'red';
  } else {
    color = 'green';
  }
  return { color, message, callsMessage };
}

function ConnectionStatusModalContent({
  message,
  callsMessage,
  onClick,
  connected,
  doNotDisturb
}) {
  return (
    <Modal.Content>
      <Modal.Description>
        <p>{message}</p>
        <p>{callsMessage}</p>
      </Modal.Description>
    </Modal.Content>
  );
}

export class ConnectionStatusModal extends Component {
  static propTypes = {
    connected: PropTypes.bool.isRequired,
    activeNumber: PropTypes.string,
    doNotDisturb: PropTypes.bool.isRequired,
    getMe: PropTypes.func.isRequired,
    setUserDoNotDisturb: PropTypes.func.isRequired
  };

  state = {
    loading: false
  };

  inlineStyle = {
    modal: {
      marginTop: '0px !important',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.getMe().then(result => {
      logMessage(result);
      if (result && !result.error) {
        this.props.setUserDoNotDisturb(result.payload.doNotDisturb).then(() => {
          this.setState({ loading: false });
        });
      }
    });
  }

  logUserAction = () => {
    actionMessage(`Calls: User clicks on Connection Status Button`);
  };

  dontDisturbAction = () => {
    logMessage('doNotDisturb');
    this.setState({ loading: true });
    this.props.setUserDoNotDisturb(!this.props.doNotDisturb).then(() => {
      this.setState({ loading: false });
    });
  };

  render() {
    const { connected, activeNumber, doNotDisturb } = this.props;
    const { color, message, callsMessage } = getUiProperties(
      connected,
      activeNumber,
      doNotDisturb
    );

    return (
      <Modal
        size="tiny"
        dimmer="blurring"
        style={this.inlineStyle.modal}
        closeIcon
        trigger={
          <ConnectionIcon
            color={color}
            message={message}
            onClick={this.logUserAction}
          />
        }
      >
        <Modal.Header>
          <Icon name="circle" color={color} /> {'Your connection status'}
        </Modal.Header>
        <ConnectionStatusModalContent
          message={message}
          callsMessage={callsMessage}
          onClick={this.dontDisturbAction}
          doNotDisturb={doNotDisturb}
          connected={connected}
        />
      </Modal>
    );
  }
}

export default ConnectionStatusModal;
