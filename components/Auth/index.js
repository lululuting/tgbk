import React, { Component } from 'react';

// hoc
const loginAuth = (WrappedComponent) => {
	return class extends Component {
		isAuth = () => {

		}

		render() {
			return (
				<WrappedComponent
				 	onClick={this.isAuth}
					{...this.props}
					ref={instanceComponent => this.instanceComponent = instanceComponent}
				/>)
		}
	}
}

export default loginAuth;