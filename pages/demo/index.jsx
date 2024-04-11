import React from 'react';
import Head from '@/components/Head';
import { Starport } from '@react-starport/core';

// import BaseList from '@/components/BaseList';
import './style.less';

const Demo = () => {  

  return (
    <>
      <Head>
        <title>Demo</title>
      </Head>

      <div className="demo-box">
        <div style={{height: 1000}}> </div>
        <Starport port="my-id"> 
          <div style={{width: 60, height: 60, border: '1px solid #333', transition: 'all 0.7s'}}></div>
        </Starport>

      </div>
    </>
  );
};

export default Demo;
