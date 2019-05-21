import { connect } from 'react-redux';

import CallModalScreen from './CallModalScreen';

function mapStateToProps(state) {
  const { call } = state.calls;
  return {
    onCall: call.onCall,
    calling: call.calling,
    receivingCall: call.receivingCall
  };
}

export default connect(mapStateToProps)(CallModalScreen);
