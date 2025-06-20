import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import React from 'react'
import { FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BackDrop from './BackDrop';
import { logOutUser } from '../store/actions';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const {user} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logoutHandler = () => {
    dispatch(logOutUser(navigate))
  };
  return (
    <div className='relative z-30'>
      <div
      className='sm:border-[1px] sm:border-slate-400 flex flex-tow items-center gap-1 rounded-full cursor-pointer hover: shadow-md transition text-slate-700'
        onClick={handleClick}
      >
        <Avatar calt='Menu' src=''></Avatar>
      </div>
      <Menu
        sx={{width:"400px"}}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
            sx: {width: 160},
          },
        }}
      >
        <Link to="/profile">
        <MenuItem className='flex gap-2' onClick={handleClose}> <FaUser className='text-xl'/>
        <span className='font-bold text-[16px] mt-1'>
            {user?.username}
        </span>
        </MenuItem> </Link>

        <Link to="/profile/addProduct">
        <MenuItem className='flex gap-2' onClick={handleClose}> <FaBoxOpen className='text-xl'/>
        <span className='font-semibold'>
            Add Product
        </span>
        </MenuItem> </Link>
        
        <MenuItem disableGutters>
          <div className="w-full flex justify-center">
            <button
              onClick={() => {
                handleClose();
                logoutHandler();
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded px-6 py-2 mt-2 flex items-center gap-2 hover:from-purple-500 hover:to-pink-400 transition shadow"
            >
              <FaSignOutAlt className="text-xl" />
              LogOut
            </button>
          </div>
        </MenuItem>
      </Menu>
      {open && <BackDrop/>}
    </div>
  );
}

export default UserMenu
