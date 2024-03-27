import React, { Component } from 'react';
import { getIsLogin } from '@/public/utils/utils';

// hoc
const loginAuth = (WrappedComponent) => {
  return class extends Component {

    componentDidMount () {
      if (getIsLogin()) {
        // console.log(123);
      }
    }
    isAuthFn = () => {
      // alert('Hi');
    };
    render () {
      const newProps = {
        isAuth: true,
        isAuthFn: this.isAuthFn
      };

      return  <WrappedComponent {...this.props} {...newProps} />;
    }
  };
};

export default loginAuth;
