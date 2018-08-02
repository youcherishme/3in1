import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextAreaFieldGroup = ({
  id,
  name,
  placeholder,
  value,
  error,
  info,
  hide,
  onChange
}) => {
  return (
    <div className={hide ? 'd-none' : ''}>
      <div className="form-group">
        {info && <label htmlFor={id}>{info}</label>}
        <textarea
          id={id}
          className={classnames('form-control form-control-lg', {
            'is-invalid': error
          })}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

TextAreaFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TextAreaFieldGroup;
