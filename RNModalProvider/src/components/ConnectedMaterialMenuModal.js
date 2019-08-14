import React from 'react';
import { View } from 'react-native';

import { withModal } from './ModalProvider';

// XXX: This is the implementation of the contents of the Modal.
export default withModal(
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

