# os-number-input



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                   | Type      | Default     |
| ---------- | ----------- | ----------------------------------------------------------------------------- | --------- | ----------- |
| `disabled` | `disabled`  | Decides if input is disabled                                                  | `boolean` | `false`     |
| `info`     | `info`      | An info message displayed under the input                                     | `string`  | `undefined` |
| `label`    | `label`     | The text label displayed above the input field                                | `string`  | `undefined` |
| `max`      | `max`       | The maximum input value allowed                                               | `number`  | `undefined` |
| `min`      | `min`       | The minimum input value allowed                                               | `number`  | `undefined` |
| `name`     | `name`      | The name of the input field                                                   | `string`  | `undefined` |
| `noBorder` | `no-border` | Should the border displayed on the left side of the input field remain hidden | `boolean` | `false`     |
| `required` | `required`  | Decides if input field required                                               | `boolean` | `false`     |


## Events

| Event      | Description                                               | Type                      |
| ---------- | --------------------------------------------------------- | ------------------------- |
| `osBlur`   | Event emitted when the user clicks out of the input field | `CustomEvent<FocusEvent>` |
| `osChange` | Event emitted during a value in change the input field    | `CustomEvent<InputEvent>` |
| `osFocus`  | Event emitted when the user clicks into the input field   | `CustomEvent<FocusEvent>` |
| `osInput`  | Event emitted during a value in change the input field    | `CustomEvent<InputEvent>` |


## Methods

### `selectText() => Promise<void>`

Input select method

#### Returns

Type: `Promise<void>`



### `setError(error: string) => Promise<void>`

Input error method

#### Returns

Type: `Promise<void>`



### `setFocus() => Promise<void>`

Input focus method

#### Returns

Type: `Promise<void>`



### `setWarning(warning: string) => Promise<void>`

Input warning method

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [os-input](../os-input)

### Graph
```mermaid
graph TD;
  os-number-input --> os-input
  style os-number-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
