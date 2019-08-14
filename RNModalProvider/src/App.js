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
import ConnectedMaterialMenuModal from './components/ConnectedMaterialMenuModal';

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
        position={layout => ({
          position: 'absolute',
          left: layout.x,
          top: layout.y,
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
              '  - Enforcing a sequence of `<Modal />` presentation, just in the order they attempted to be visible.',
              '  - Working around differences in [React Native Web](https://github.com/necolas/react-native-web/issues/1020)\'s presentation of `<Modal />` content.',
              '  - Providing the ability to adjust the layout of a presented Modal.',
              '  - Persisting shared properties across `<Modal />`s to ensure a consistent experience.',
              '### 🙈 What is this not?',
              '  - A `<Modal />`.',
              '### ✍️ Tutorial',
              'Okay, here\'s how this is going to work:\n',
              'Tapping **Menu One** below will open a menu. You can choose to close the menu, or open **Menu Two**. Since both of these are presented using _the same_ `<Modal />` instance, **Menu Two** will not be able to open until **Menu One** has closed. This emphasises that attempts to open `<Modal />`\ are queued.',
            ].join('\n')}
          </Markdown>
          <View
            style={styles.tutorial}
          >
            <ConnectedMaterialMenuModal
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
            </ConnectedMaterialMenuModal>
            <ConnectedMaterialMenuModal
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
            </ConnectedMaterialMenuModal>
          </View>
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
