import {useRoute} from '@react-navigation/native';
import React from 'react';

class useRouteName extends React.Component {
  render() {
    // Get it from props
    const route = this.props;
    return {route: route};
  }
}

export default useRouteName;
