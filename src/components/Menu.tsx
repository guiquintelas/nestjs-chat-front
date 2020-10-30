import React, { cloneElement, Children, isValidElement } from 'react';
import MuiMenu from '@material-ui/core/Menu';
import { MenuItemProps } from '@material-ui/core/MenuItem';

type MenuProps = {
  anchor: JSX.Element;
};

const Menu: React.FC<MenuProps> = ({ anchor, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const propsToHandleMenuLocation = {
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
  } as const;

  // injects `handleToggle` in onClick
  const renderAncorWithProps = cloneElement(anchor, {
    'aria-controls': 'simple-menu',
    'aria-haspopup': 'true',
    onClick: (e: any) => {
      if (anchor.props.onClick) {
        anchor.props.onClick();
      }
      handleClick(e);
    },
  });

  // injects `handleClose` in onClick
  const renderChildrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement<MenuItemProps>(child, {
        onClick: () => {
          if (child.props.onClick) {
            child.props.onClick();
          }
          handleClose();
        },
      });
    }
    return child;
  });

  return (
    <>
      {renderAncorWithProps}

      <MuiMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        {...propsToHandleMenuLocation}
        onClose={handleClose}
      >
        {renderChildrenWithProps}
      </MuiMenu>
    </>
  );
};

export default Menu;
