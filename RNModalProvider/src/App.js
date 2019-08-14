import React from 'react';
import {
  Text,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import ModalProvider, { withModal } from './components/ModalProvider';

const styles = StyleSheet
  .create(
    {
      container: {
        backgroundColor: 'green',
      },
      menu: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
    },
  );

// XXX: This is an example of an existing Modal that can converted
//      into a react-native-modal-provider compatible Modal class.
//      * Fundamentally, they must accept a "visible" prop.
class MaterialMenuModal extends React.Component {
  componentDidMount() {
    const { visible } = this.props;
    if (visible) {
      const { menu } = this.refs;
      menu.show();
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const { visible } = nextProps;
    const { menu } = this.refs;
    if (visible && !this.props.visible) {
      menu.show();
    } else if (!visible && this.props.visible) {
      menu.hide();
    }
  }
  render() {
    const {
      visible,
      children,
      testing,
      ...extraProps
    } = this.props;
    return (
      <Menu
        {...extraProps}
        ref="menu"
        style={styles.menu}
      >
        {children}
      </Menu>
    );
  }
}

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
