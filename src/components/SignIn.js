import React from "react";

export default class SignIn extends React.Component {
	state = {
		username: "",
		password: ""
	};
	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	render() {
		return (
			<div>
				<h3>Sign In</h3>
				<div className='flex flex-1 justify-center'>
					<div className='w-full max-w-144'>
						<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
							<div className='mb-4'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='username'
								>
									Username
								</label>
								<input
									onChange={this.onChange}
									name='username'
									autoComplete='on'
									className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									id='username'
									type='text'
									placeholder='Username'
								/>
							</div>
							<div className='mb-6'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='password'
								>
									Password
								</label>
								<input
									onChange={this.onChange}
									name='password'
									autoComplete='on'
									className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
									id='password'
									type='password'
									placeholder='******************'
								/>
							</div>
							<div className='flex items-center justify-between'>
								<button
									onClick={() => this.props.signIn(this.state)}
									className='bg-secondary hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
									type='button'
								>
									Sign In
								</button>
								<span
									className='inline-block align-baseline font-bold text-sm'
									onClick={() => this.props.toggleFormState("forgotPassword")}
								>
									Forgot Password
								</span>
								<button
									onClick={() => this.props.toggleFormState("signUp")}
									className='bg-secondary hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
									type='button'
								>
									Sign Up
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
