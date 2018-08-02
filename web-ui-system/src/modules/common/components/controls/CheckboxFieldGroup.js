import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const CheckboxFieldGroup = ({
  id,
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
  hide,
}) => {
  return (
    <div className={hide ? 'd-none' : ''}>
      <div className="form-group">
        {info && <label htmlFor={id}>{info}</label>}
        <input
          id={id}
          type={type}
          className={classnames('form-control form-control-lg', {
            'is-invalid': error
          })}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

CheckboxFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

CheckboxFieldGroup.defaultProps = {
  type: 'text'
};

export default CheckboxFieldGroup;
