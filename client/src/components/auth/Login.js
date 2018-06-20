import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser } from '../../actions/auth';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            console.log('here');
            this.props.history.push('/dashboard');
        }
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }
    render() {
        const { errors } = this.state;
        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to your DevConnector account</p>
                            <form noValidate onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    type="email"
                                    name="email"
                                    error={errors.email}
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    placeholder="Email Address"
                                />
                                <TextFieldGroup
                                    type="password"
                                    name="password"
                                    error={errors.password}
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    placeholder="Password"
                                />
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

function mapStateToProps({ auth, errors }) {
    return {
        auth, errors
    };
}

export default connect(mapStateToProps, { loginUser })(Login);