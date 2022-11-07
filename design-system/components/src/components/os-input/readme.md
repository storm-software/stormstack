# my-component



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                    | Type      | Default     |
| ---------- | ---------- | ---------------------------------------------- | --------- | ----------- |
| `disabled` | `disabled` | Decides if input is disabled                   | `boolean` | `false`     |
| `error`    | `error`    | Decides if input has an error                  | `boolean` | `false`     |
| `label`    | `label`    | The text label displayed above the input field | `string`  | `undefined` |
| `name`     | `name`     | The name of the input field                    | `string`  | `undefined` |
| `required` | `required` | Decides if input field required                | `boolean` | `false`     |
| `touched`  | `touched`  | Show if input is touched                       | `boolean` | `false`     |
| `type`     | `type`     | Type of input                                  | `string`  | `"text"`    |
| `warning`  | `warning`  | Decides if input has an error                  | `boolean` | `false`     |


## Events

| Event      | Description                                            | Type                               |
| ---------- | ------------------------------------------------------ | ---------------------------------- |
| `osChange` | Event emitted during a value in change the input field | `CustomEvent<CustomEvent<string>>` |


## Methods

### `selectText() => Promise<void>`

Input select method

#### Returns

Type: `Promise<void>`



### `setFocus() => Promise<void>`

Input focus method

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
