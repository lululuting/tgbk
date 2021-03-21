import React, { Component } from 'react';

// hoc
const loginAuth = (WrappedComponent) => {
	return class extends Component {
		isAuthFn = () => {
			alert('Hi')
		}
		render() {
			const newProps = {
				isAuth: true,
				isAuthFn: this.isAuthFn
			}
			return (
				<WrappedComponent
					{...this.props}
					{...newProps}
				/>)
		}
	}
}

export default loginAuth;