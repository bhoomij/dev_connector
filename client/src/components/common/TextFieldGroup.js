import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
    name, placeholder, value, error, onChange, disabled, info, type
}) => {
    return (
        <div className="form-group">
            <input type={type}
                className={classnames("form-control form-control-lg", {
                    'is-invalid': error
                })}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    );
};

TextFieldGroup.protoTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    info: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.func,
};

TextFieldGroup.defaults = {
    type: 'text'
}

export default TextFieldGroup;