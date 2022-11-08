# my-component



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                       | Type      | Default     |
| ------------- | ------------- | --------------------------------------------------------------------------------- | --------- | ----------- |
| `disabled`    | `disabled`    | Decides if input is disabled                                                      | `boolean` | `false`     |
| `info`        | `info`        | An info message displayed under the input                                         | `string`  | `undefined` |
| `label`       | `label`       | The text label displayed above the input field                                    | `string`  | `undefined` |
| `max`         | `max`         | The maximum input value allowed                                                   | `number`  | `undefined` |
| `maxLength`   | `max-length`  | The maximum allowed input length value of the field                               | `number`  | `undefined` |
| `min`         | `min`         | The minimum input value allowed                                                   | `number`  | `undefined` |
| `minLength`   | `min-length`  | The minimum allowed input length value of the field                               | `number`  | `undefined` |
| `name`        | `name`        | The name of the input field                                                       | `string`  | `undefined` |
| `noBorder`    | `no-border`   | Should the border displayed on the left side of the input field remain hidden     | `boolean` | `false`     |
| `pattern`     | `pattern`     | A regular expression pattern, such as [A-Z]+ for one or more uppercase characters | `string`  | `undefined` |
| `placeholder` | `placeholder` | Placeholder text when the field value is empty                                    | `string`  | `undefined` |
| `required`    | `required`    | Decides if input field required                                                   | `boolean` | `false`     |
| `type`        | `type`        | Type of input                                                                     | `string`  | `"text"`    |


## Events

| Event      | Description                                               | Type                               |
| ---------- | --------------------------------------------------------- | ---------------------------------- |
| `osBlur`   | Event emitted when the user clicks out of the input field | `CustomEvent<CustomEvent<void>>`   |
| `osChange` | Event emitted during a value in change the input field    | `CustomEvent<CustomEvent<string>>` |
| `osFocus`  | Event emitted when the user clicks into the input field   | `CustomEvent<CustomEvent<void>>`   |


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




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
