import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const SelectListGroup = (
  {
    id,
    name,
    value,
    error,
    info,
    onChange,
    options,
    disabled,
    hide,
  }) => {
  var selectOptions = '';
  if (options && options.length) {
    selectOptions = options.map(option => (
      <option key={option.label} value={option.value}>
        {option.label}
      </option>
    ));
  }
  return (
    <div className={hide ? 'd-none' : ''}>
      <div className="form-group">
        {info && <label htmlFor={id}>{info}</label>}
        <select
          id={id}
          className={classnames('form-control form-control-lg', {
            'is-invalid': error
          })}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {selectOptions}
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default SelectListGroup;
