import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const TopMenu = ({ color }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGenerateClick = (idx) => {
    if (idx == 0){
      navigate('/');
    } else if (idx == 1) {
      navigate('/generate-vn');
    } else {
      navigate('/library');
    }
    
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  }

  const closeMenu = () => {
    setShowDropdown(false);
  }

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const menuStyle = {
    backgroundColor: color || 'blue',
    display: 'flex',
    justifyContent: 'space-between', // This will push the items to opposite sides
    alignItems: 'center', // Vertically centers the items
  };

  const iconStyle = {
    cursor: 'pointer',
    margin: '10px 20px 10px 20px'
  };

  return (
    <div className = "topMenuAll">
    <div className="topMenu" style={menuStyle}>
      <div style={iconStyle} onClick={toggleMenu}>
        {/* Hamburger menu on the left */}
        <FontAwesomeIcon icon={faBars} size="lg" color="white" />
      </div>
      <div style={iconStyle}>
        {/* Login icon on the right */}
        <FontAwesomeIcon icon={faUserCircle} size="lg" color="white" />
      </div>
      
    </div>
    {
      showDropdown ?
      (
        <div className="dropdown-menu ">
          <button onClick={() => {handleGenerateClick(0)}}><p className='darumadrop-one-regular'>Go Home</p></button>
          <button onClick={() => {handleGenerateClick(1)}}><p className='darumadrop-one-regular'>Generate VN</p></button>
          <button onClick={() => {handleGenerateClick(2)}}><p className='darumadrop-one-regular'>Load Existing VN</p></button>
        </div>
      ):
      null

    }
    </div>
  );
};

export default TopMenu;
