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
    const { container } = this.refs;
    // XXX: Note that the layout we store is the *absolute* layout.
    return new Promise(
      resolve => container
        .measure(
          (x, y, width, height, pageX, pageY) => this.setState(
            {
              layout: {
                x: pageX,
                y: pageY,
                width,
                height,
              },
            },
            resolve,
          ),
        ),
    );
  }
  async componentWillUpdate(nextProps, nextState) {
    const {
      visible,
      children,
      ...extraProps
    } = nextProps;
    const {
      uuid,
      layout,
    } = nextState;
    const {
      requestOpen,
      requestDismiss,
    } = this.context;
    const shouldRequestOpen = () => requestOpen(
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
    if (visible && ((!!layout) && !this.state.layout)) {
      return shouldRequestOpen();
    } else if (visible && !this.props.visible) {
      return shouldRequestOpen();
    } else if (!visible && this.props.visible) {
      return requestDismiss(
        uuid,
      );
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
      layout,
    } = this.state;
    return (
      <View
        ref="container"
        onLayout={this.__onLayout}
      >
        <BaseComponent
          {...extraProps}
          visible={uuid === contextUuid}
          layout={layout}
        />
      </View>
    );
  }
};

class ModalProvider extends React.Component {
  constructor(props) {
    super(props);
    this.__requestOpen = this.__requestOpen.bind(this);
    this.__requestDismiss = this.__requestDismiss.bind(this);
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
              ...this.state.l,
              [uuid]: { ...layout },
            },
            p: {
              ...this.state.p,
              [uuid]: { ...props },
            },
            c: {
              ...this.state.c,
              [uuid]: ModalChild,
            },
          },
          resolve,
        ),
      ),
    )
      .then(() => {
        const { q, visible } = this.state;
        if (!visible && q.length > 0) {
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
  __requestDismiss(uuid) {
    return new Promise(
      resolve => this.requestAnimationFrame(
        () => this.setState(
          {
            visible: (this.state.q[0] === uuid) ? false : this.state.visible,
            q: this.state.q
              .filter(e => e !== uuid),
            l: {
              ...this.state.l,
              [uuid]: undefined,
            },
            p: {
              ...this.state.p,
              [uuid]: undefined,
            },
            c: {
              ...this.state.c,
              [uuid]: undefined,
            },
          },
          resolve,
        ),
      ),
    )
      .then(() => {
        const { q } = this.state;
        if (q.length > 0) {
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
          requestOpen: this.__requestOpen,
          requestDismiss: this.__requestDismiss,
          uuid,
        }}
      >
        {children}
        {((Platform.OS !== 'web') || visible) && (
          <View
            style={position(layout)}
          >
            <ModalComponent
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
  position: PropTypes.func,
};

ModalProvider.defaultProps = {
  ModalComponent: Modal,
  position: layout => ({}),
};

Object.assign(
  ModalProvider.prototype,
  require('react-timer-mixin'),
);

export default ModalProvider;
