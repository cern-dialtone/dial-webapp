import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { dialpadActions, callActions } from 'dial-core';

import withPhoneService from 'calls/providers/PhoneProvider/PhoneService';
import { CallerDialpadForm } from './CallerDialpadForm';

function mapStateToProps({ calls }) {
  return {
    value: calls.dialpad.value
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      makeCall: callActions.makeCall,
      updateDialpadValue: dialpadActions.updateDialpadValue
    },
    dispatch
  );
}

export const CallerDialpad = connect(
  mapStateToProps,
  mapDispatchToProps
)(CallerDialpadForm);

export default withPhoneService(CallerDialpad);