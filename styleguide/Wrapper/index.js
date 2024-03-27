import React from 'react';
import { IntlProvider } from 'react-intl'
import 'antd/dist/antd.css'
import './style.css';
export default class Wrapper extends React.Component {
  render() {
    return (
      <IntlProvider locale="en">{this.props.children}</IntlProvider>
    )
  }
}


// function Wrapper({ Component, pageProps, children }) {
//   return <div {...pageProps}>{children}</div>;
// }

// export default Wrapper
