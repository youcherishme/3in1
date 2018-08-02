import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const AutoSuggestFieldGroup = ({
  id,
  name,
  value,
  error,
  info,
  type,
  onChange,
  disabled,
  options,
  optionRenderer,
  filterOption,
  removeSelected,
  hide,
}) => {
  return (
    <div className={hide ? 'd-none' : ''}>
      <div className="form-group">
        {info && <label htmlFor={id}>{info}</label>}
        <Select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          options={options}
          optionRenderer={optionRenderer}
          //multi
          filterOption={filterOption}
          removeSelected={removeSelected}
        />

        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

AutoSuggestFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

AutoSuggestFieldGroup.defaultProps = {
  type: 'text'
};

export default AutoSuggestFieldGroup;
