import React from 'react';

const TopMenu = ({ color }) => {
  const menuStyle = {
    backgroundColor: color || 'blue', 
  };

  return (
    <div className={"topMenu"} style={menuStyle}>
    </div>
  );
};

export default TopMenu;
