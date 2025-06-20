import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loader = ({text}) => {
  return (
    <div >
      <PuffLoader color="#4A90E2" size={80} speedMultiplier={1} />
      <p className='text-slate-700'>
        {text ? text : "please wait..."}</p>
    </div>
  );
};

export default Loader;
