# os-button



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute              | Description                                         | Type                                                                                                                                         | Default                           |
| --------------------- | ---------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `disabled`            | `disabled`             | Is the button read-only (cannot be clicked by user) | `boolean`                                                                                                                                    | `false`                           |
| `inverse`             | `inverse`              | Is the button filled by default                     | `boolean`                                                                                                                                    | `false`                           |
| `transitionDirection` | `transition-direction` | The direction the hover animation will start on     | `ButtonTransitionDirections.BOTTOM \| ButtonTransitionDirections.LEFT \| ButtonTransitionDirections.RIGHT \| ButtonTransitionDirections.TOP` | `ButtonTransitionDirections.LEFT` |
| `type`                | `type`                 | Is the button filled by default                     | `ButtonTypes.BUTTON \| ButtonTypes.RESET \| ButtonTypes.SUBMIT`                                                                              | `ButtonTypes.BUTTON`              |
| `variant`             | `variant`              | The variant style of the button                     | `ButtonVariants.GRADIENT \| ButtonVariants.PRIMARY \| ButtonVariants.SECONDARY \| ButtonVariants.TERTIARY`                                   | `ButtonVariants.PRIMARY`          |


## Events

| Event     | Description                                        | Type                      |
| --------- | -------------------------------------------------- | ------------------------- |
| `osClick` | Event emitted when the user clicks into the button | `CustomEvent<MouseEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
