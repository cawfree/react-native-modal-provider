import React from 'react';
import {
  Text,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import { MenuItem, MenuDivider } from 'react-native-material-menu';

import ModalProvider, { withModal } from './components/ModalProvider';
import MaterialMenuModal from './components/MaterialMenuModal';

const styles = StyleSheet
  .create(
    {
      container: {
        backgroundColor: 'green',
      },
    },
  );

const ConnectedMaterialModal = withModal(
  ({ children, ...extraProps }) => {
    return (
      <React.Fragment
      >
        {children}
      </React.Fragment>
    );
  },
  ({ visible, button: ButtonComponent }) => {
    if (!visible) {
      return (
        <ButtonComponent
        />
      );
    }
    return (
      <React.Fragment
      />
    );
  },
);


class App extends React.Component {
  state = {
    visible: false,
  };
  render() {
    const { visible } = this.state;
    return (
      <ModalProvider
        ModalComponent={MaterialMenuModal}
        position="relative"
        position={layout => ({
          marginLeft: layout.x,
          marginTop: layout.y,
        })}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.container,
            {
              padding: 250,
            },
          ]}
        >
          <ConnectedMaterialModal
            visible={visible}
            button={
              ({ layout, ...extraProps }) => {
                return (
                  <Text
                    onPress={() => this.setState({
                      visible: true,
                    })}
                  >
                    {'Press Me'}
                  </Text>
                );
              }
            }
          >
            <MenuItem>{'Welcome 2!'}</MenuItem>
          </ConnectedMaterialModal>
        </View>
      </ModalProvider>
    );
  }
}

let hotWrapper = () => () => App;
if (Platform.OS === 'web') {
  const { hot } = require('react-hot-loader');
  hotWrapper = hot;
}
export default hotWrapper(module)(App);
