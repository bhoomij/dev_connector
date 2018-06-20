import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser } from '../../actions/auth';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {},
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
        }
        this.props.registerUser(newUser, this.props.history);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }
    render() {
        const { errors } = this.state;
        const { user } = this.props.auth;
        return (
            <div className="register">
                {user ? user.name : null}
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form noValidate onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    name="name"
                                    error={errors.name}
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    placeholder="Name"
                                />
                                <TextFieldGroup
                                    name="email"
                                    type="email"
                                    error={errors.email}
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    placeholder="Email Address"
                                    info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                                />
                                <TextFieldGroup
                                    name="password"
                                    type="password"
                                    error={errors.password}
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    placeholder="Password"
                                />
                                <TextFieldGroup
                                    name="password2"
                                    type="password"
                                    error={errors.password2}
                                    value={this.state.password2}
                                    onChange={this.onChange}
                                    placeholder="Confirm password"
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
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = ({ auth, errors }) => {
    return {
        auth,
        errors
    };
}

export default connect(mapStateToProps, { registerUser })(Register);