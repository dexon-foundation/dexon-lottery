import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { timingFunctions } from 'polished';
import noop from 'lodash/noop';

const getBorderColor = (props) => {
  if (props.hasError) {
    return '#FF435A!important';
  }

  if (props.hasWarning) {
    return '#F69355!important';
  }

  if (props.hasFocus) {
    return '#37454E!important';
  }

  return '#AAB9C2';
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid ${getBorderColor};
  border-radius: 3px;
  transition: .2s border-color;
`;

const InputComponent = styled.input`
  font-family: 'Overpass', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 20px;
  text-overflow: ellipsis;
  color: #122028;
  background: ${props => (props.readOnly ? '#F8F8F8' : 'transparent')};
  padding: 10px 12px;
  padding-right: ${props => (props.hasUnit ? 112 : 12)}px;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  display: block;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #122028;
  }
`;

const TextArea = InputComponent.withComponent('textarea').extend`
  min-height: ${props => props.height || 82}px;
  height: ${props => props.height || 82}px;
  white-space: ${props => props.whiteSpace || 'initial'};
`;

const TooltipBox = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 3px;
  z-index: 1;
  background-color: #FFFFFF;
  border-radius: 4px;
  padding: ${props => (props.hasContent ? '4px 10px' : 0)};
  box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: ${props => (props.isActive && props.hasContent ? 1 : 0)};
  transform: ${props => (props.isActive && props.hasContent ? 'none' : 'translateY(10px)')};
  transition:
    .2s opacity ${timingFunctions('easeInOutQuad')},
    .2s transform ${timingFunctions('easeInOutQuad')}
  ;
`;

const Error = styled.li`
  color: #FF435A;
`;

const Warning = styled.li`
  color: #F69355;
`;

class Input extends PureComponent {
  props: {
    className: String,
    unit: String,
    isOptional: Boolean,
    isMultiline: Boolean,
    disabled: Boolean,
    validators: Array<Function>,
    onChange: Function,
    onError: Function,
    value: String,
  };

  static defaultProps = {
    validators: [],
    onChange: noop,
    onError: noop,
  };

  state = {
    hasFocus: false,
    errors: [],
    warnings: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.handleValidation(this.props);
    }
  }

  handleFocus = () => this.setState({ hasFocus: true });
  handleBlur = () => this.setState({ hasFocus: false });

  handleChange = (event) => {
    const { onChange } = this.props;
    const { target: { name, value } } = event;

    onChange(event);
    this.handleValidation({ name, value });
  }

  handleValidation = ({ name, value }) => {
    const { onError, validators } = this.props;

    const errors = [];
    const warnings = [];

    if (value) {
      validators.forEach(({ test, message, isWarning }) => {
        if (!test(value)) {
          if (isWarning) {
            warnings.push(message);
          } else {
            errors.push(message);
          }
        }
      });
    }
    this.setState({ errors, warnings }, () => {
      onError({
        name,
        hasError: Boolean(this.state.errors.length),
      });
    });
  }

  render() {
    const { className, unit, onChange, isOptional, isMultiline, ...props } = this.props;
    const { hasFocus, errors, warnings } = this.state;
    const hasError = errors.length;
    const hasWarning = warnings.length;
    const Component = isMultiline ? TextArea : InputComponent;

    return (
      <Wrapper
        className={className}
        hasFocus={hasFocus}
        hasError={hasError}
        hasWarning={hasWarning}
        isOptional={isOptional}
      >
        <Component
          {...props}
          hasUnit={Boolean(unit)}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />

        <TooltipBox
          isActive={hasFocus}
          hasContent={hasError || hasWarning}
        >
          {errors.map((error, index) => (
            <Error key={index}>
              {error}
            </Error>
          ))}

          {warnings.map((warning, index) => (
            <Warning key={index}>
              {warning}
            </Warning>
          ))}
        </TooltipBox>
      </Wrapper>
    );
  }
}

export default Input;
