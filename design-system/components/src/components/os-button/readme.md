# os-button



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute              | Description                                         | Type      | Default                           |
| --------------------- | ---------------------- | --------------------------------------------------- | --------- | --------------------------------- |
| `disabled`            | `disabled`             | Is the button read-only (cannot be clicked by user) | `boolean` | `false`                           |
| `inverse`             | `inverse`              | Is the button filled by default                     | `boolean` | `false`                           |
| `transitionDirection` | `transition-direction` | The direction the hover animation will start on     | `string`  | `ButtonTransitionDirections.LEFT` |
| `type`                | `type`                 | Is the button filled by default                     | `string`  | `ButtonTypes.BUTTON`              |
| `variant`             | `variant`              | The variant style of the button                     | `string`  | `ButtonVariants.PRIMARY`          |


## Events

| Event     | Description                                        | Type                      |
| --------- | -------------------------------------------------- | ------------------------- |
| `osClick` | Event emitted when the user clicks into the button | `CustomEvent<MouseEvent>` |


## Dependencies

### Used by

 - [os-card](../os-card)

### Graph
```mermaid
graph TD;
  os-card --> os-button
  style os-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
