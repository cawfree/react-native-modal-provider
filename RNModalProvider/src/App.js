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

// XXX: This is the implementation of the contents of the Modal.
const ConnectedMaterialModal = withModal(
  // XXX: What to render when the Modal is open.
  ({ children, ...extraProps }) => {
    return (
      <React.Fragment
      >
        {children}
      </React.Fragment>
    );
  },
  // What to render in the Modal's place whilst it isn't open.
  // Note that you can do things dynamically.
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
    visible: true,
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
            <MenuItem
              onPress={() => this.setState({
                visible: false,
              })}
            >
              {'Welcome 2!'}
            </MenuItem>
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
