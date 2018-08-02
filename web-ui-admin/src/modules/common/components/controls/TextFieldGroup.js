import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
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
  checked,
  hide,
}) => {
  return (
    <div className={hide ? 'd-none' : ''}>
      <div className="form-group">
        {info && <label htmlFor={id} >{info}</label>}
        <input
          id={id}
          type={type}
          className={classnames('form-control form-control-lg',
          {
            'is-invalid': error
          })}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          checked={checked}
          />
        {error && <div className={classnames('invalid-feedback')}>{error}</div>}
      </div>
    </div>
      

  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: 'text'
};

export default TextFieldGroup;
