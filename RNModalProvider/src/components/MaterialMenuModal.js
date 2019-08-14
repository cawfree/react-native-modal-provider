import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Menu  from 'react-native-material-menu';

import { withModal } from './ModalProvider';

const styles = StyleSheet
  .create(
    {
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

MaterialMenuModal.propTypes = {
  visible: PropTypes.bool,
};

MaterialMenuModal.defaultProps = {
  visible: false,
};

export default MaterialMenuModal;
