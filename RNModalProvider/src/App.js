import React from 'react';
import {
  Text,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import { MenuItem, MenuDivider } from 'react-native-material-menu';

import ModalProvider, { withModal } from './components/ModalProvider';
import MaterialMenuModal from './components/MaterialMenuModal';

const styles = StyleSheet
  .create(
    {
      container: {
      },
      tutorial: {
        padding: 50,
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
  // Here we perform some steps to aid correct rendering of
  // the material-menu when opened in the shared absolute layout.
  ({ layout, visible, button: ButtonComponent }) => {
    if (!visible) {
      return (
        <ButtonComponent
        />
      );
    }
    const { width, height } = layout;
    return (
      <View
        style={{
          width,
          height,
        }}
      />
    );
  },
);


class App extends React.Component {
  state = {
    showMenuOne: false,
    showMenuTwo: false,
  };
  render() {
    const {
      showMenuOne,
      showMenuTwo,
    } = this.state;
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
          ]}
        >
          <Markdown
          >
            {[
              '## Hello!',
              'Welcome to [**react-native-modal-provider**](https://github.com/cawfree/react-native-modal-provider).',
              '### 🤔 What is this for?',
              'There are a couple of main use cases:\n',
              '  - Ensuring you only display one `<Modal />` at a time.',
              '  - Enforcing a sequence of `<Modal />` presentation.',
              '  - Working around differences in [React Native Web](https://github.com/necolas/react-native-web/issues/1020)\'s presentation of `<Modal />` content.',
              '  - Providing the ability to adjust the layout of a presented Modal.',
              '  - Persisting shared properties across `<Modal />`s.',
              '### 🙈 What is this not?',
              '  - A `<Modal />`.',
              '### ✍️ Tutorial',
              'Okay, here\'s how this is going to work:',
              'Tapping **Menu One** below will open a menu. You can choose to close the menu, or open **Menu Two**. Since both of these are presented using a `<Modal />`, **Menu Two** will not be able to open until **Menu One** has closed. This emphasises that attempts to open `<Modal />`\ are queued.',
            ].join('\n')}
          </Markdown>
          <ConnectedMaterialModal
            visible={showMenuOne}
            button={
              ({ ...extraProps }) => {
                return (
                  <Text
                    onPress={() => this.setState({
                      showMenuOne: true,
                    })}
                    children="Menu One"
                  />
                );
              }
            }
          >
            <MenuItem
              onPress={() => this.setState({
                showMenuTwo: true,
              })}
            >
              {'Open Menu Two'}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              children="Close"
              onPress={() => this.setState({
                showMenuOne: false,
              })}
            />
          </ConnectedMaterialModal>
          <ConnectedMaterialModal
            visible={showMenuTwo}
            button={
              ({ layout, ...extraProps }) => {
                return (
                  <Text
                  >
                    {'Menu Two'}
                  </Text>
                );
              }
            }
          >
            <MenuItem
              children="🥳"
            />
            <MenuDivider
            />
            <MenuItem
              onPress={() => this.setState({
                showMenuTwo: false,
              })}
              children="Close"
            />
          </ConnectedMaterialModal>
          <Markdown
          >
            {[
              '### 🍒 Contributing',
              '[Pull Requests](https://github.com/cawfree/react-native-modal-provider/pulls) are more than welcome. Please feel free to branch directly from `/master` and make your changes there.',
              '### ✌️ License',
              '[MIT](https://opensource.org/licenses/MIT)',
            ].join('\n')}
          </Markdown>
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
