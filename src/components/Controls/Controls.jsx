import { useState } from "react";
import { Container, Label } from "./styles";

function Field({ initialValue, title = "", onChange, ...rest }) {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event) => {
    const { value = "" } = event.currentTarget;
    setValue(value);
    onChange?.(Number(value));
  };
  return (
    <div>
      <Label>
        {title}: {value}
      </Label>
      <input value={value} type="range" onChange={handleChange} {...rest} />
    </div>
  );
}

function Controls({
  onDebug,
  onFrequency,
  onFPS,
  onLength,
  onLeftForce,
  onBottomForce,
  onTopForce,
  onRightForce,
  onMass,
  onMaxForce,
  onMaxVelocity,
}) {
  return (
    <Container>
      {onFPS && (
        <Field
          min="0"
          max="60"
          title="FPS"
          initialValue={60}
          onChange={onFPS}
        />
      )}
      {onLength && (
        <Field
          step="0.001"
          min="0"
          max="0.05"
          title="Length"
          initialValue={0.05}
          onChange={onLength}
        />
      )}
      {onFrequency && (
        <Field
          initialValue={1.5}
          title="Frequency"
          type="range"
          step="0.01"
          min="0"
          max="1.5"
          onChange={onFrequency}
        />
      )}
      {onLeftForce && (
        <Field
          initialValue={50}
          title="Left force"
          type="range"
          min="40"
          max="50"
          onChange={onLeftForce}
        />
      )}
      {onRightForce && (
        <Field
          initialValue={50}
          title="Right force"
          type="range"
          min="40"
          max="50"
          onChange={onRightForce}
        />
      )}
      {onBottomForce && (
        <Field
          initialValue={50}
          title="Bottom force"
          type="range"
          min="40"
          max="50"
          onChange={onBottomForce}
        />
      )}
      {onTopForce && (
        <Field
          initialValue={50}
          title="Top force"
          type="range"
          min="40"
          max="50"
          onChange={onTopForce}
        />
      )}
      {onMass && (
        <Field
          initialValue={15}
          title="Max velocity"
          type="range"
          min="1"
          max="30"
          onChange={onMass}
        />
      )}
      {onMaxForce && (
        <Field
          initialValue={0.6}
          title="Max force"
          type="range"
          min="0.1"
          max="0.8"
          step="0.01"
          onChange={onMaxForce}
        />
      )}
      {onMaxVelocity && (
        <Field
          initialValue={40}
          title="Max force"
          step="0.01"
          type="range"
          min="40"
          max="60"
          onChange={onMaxVelocity}
        />
      )}
      {onDebug && (
        <Label>
          <input type="checkbox" id="debug" onChange={onDebug} />
          <label htmlFor="debug">DEBUG</label>
        </Label>
      )}
    </Container>
  );
}

export default Controls;
