import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Modal } from 'react-native';
import uuidv4 from 'uuid/v4';

const ModalContext = React
  .createContext(
    null,
  );

export const withModal = (
  ModalContent,
  BaseComponent = View,
) => class ModalConsumer extends React.Component {
  static contextType = ModalContext;
  constructor(props) {
    super(props);
    this.__onLayout = this.__onLayout.bind(this);
    this.state = {
      uuid: uuidv4(),
      layout: undefined,
    };
  }
  __onLayout(e) {
    const { layout } = e.nativeEvent;
    return this.setState(
      {
        layout,
      },
    );
  }
  async componentDidMount() {
    const {
      visible,
      children,
      ...extraProps
    } = this.props;
    if (visible) {
      // TODO: Need to assure this works. (i.e. what if layout is called after mount?)
      const {
        uuid,
        layout,
      } = this.state;
      const { requestOpen } = this.context;
      return requestOpen(
        uuid,
        layout,
        { ...extraProps },
        () => (
          <ModalContent
          >
            {children}
          </ModalContent>
        ),
      );
    }
    return Promise
      .resolve();
  }
  async componentWillUpdate(nextProps, nextState) {
    const {
      visible,
      children,
      ...extraProps
    } = nextProps;
    const { uuid, layout  } = nextState;
    const { requestOpen } = this.context;
    if (visible && !this.props.visible) {
      return requestOpen(
        uuid,
        layout,
        { ...extraProps },
        () => (
          <ModalContent
          >
            {children}
          </ModalContent>
        ),
      );
    } else if (!visible && this.props.visible) {

    }
  }
  render() {
    const {
      visible,
      children,
      ...extraProps
    } = this.props;
    const {
      uuid: contextUuid,
    } = this.context;
    const {
      uuid,
    } = this.state;
    return (
      <View
        onLayout={this.__onLayout}
      >
      <BaseComponent
        {...extraProps}
        visible={uuid === contextUuid}
      />
      </View>
    );
  }
};

class ModalProvider extends React.Component {
  constructor(props) {
    super(props);
    this.__requestOpen = this.__requestOpen.bind(this);
    this.state = {
      visible: false,
      q: [],
      p: {},
      l: {},
      c: {},
    };
  }
  async __requestOpen(uuid, layout, props, ModalChild) {
    return new Promise(
      resolve => this.requestAnimationFrame(
        () => this.setState(
          {
            q: [
              ...this.state.q,
              uuid,
            ]
              .filter((e, i, arr) => (arr.indexOf(e) === i)),
            l: {
              [uuid]: { ...layout },
            },
            p: {
              [uuid]: { ...props },
            },
            c: {
              [uuid]: ModalChild,
            },
          },
          resolve,
        ),
      ),
    )
      .then(() => {
        const { visible } = this.state;
        if (!visible) {
          return new Promise(
            resolve => this.requestAnimationFrame(
              () => this.setState(
                {
                  visible: true,
                },
                resolve,
              ),
            ),
          );
        }
        return Promise
          .resolve();
      });
  }
  render() {
    const {
      ModalComponent,
      children,
      position,
      scale,
    } = this.props;
    const {
      visible,
      q,
      l,
      p,
      c,
    } = this.state;
    const uuid = (visible && q[0]);
    const modalProps = p[uuid] || {};
    const ModalChild = c[uuid] || React.Fragment;
    const layout = l[uuid] || {};
    return (
      <ModalContext.Provider
        value={{
          ModalComponent,
          requestOpen: this.__requestOpen,
          uuid,
        }}
      >
        {children}
        {((Platform.OS !== 'web') || visible) && (
          <View
            style={{
              ...(
                (position === 'relative' && visible) ? ({
                  marginLeft: layout.x,
                  marginTop: layout.y,
                }) : {}
              )
            }}
          >
            <ModalComponent
              testing="hi"
              visible={visible}
              {...modalProps}
            >
              <ModalChild
              />
            </ModalComponent>
          </View>
        )}
      </ModalContext.Provider>
    );
  }
}

ModalProvider.propTypes = {
  ModalComponent: PropTypes.func,
  position: PropTypes.oneOf(
    [
      'absolute',
      'relative',
    ],
  ),
};

ModalProvider.defaultProps = {
  ModalComponent: Modal,
  position: 'absolute',
};

Object.assign(
  ModalProvider.prototype,
  require('react-timer-mixin'),
);

export default ModalProvider;
