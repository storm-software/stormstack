/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface OsButton {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
    interface OsInput {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
}
declare global {
    interface HTMLOsButtonElement extends Components.OsButton, HTMLStencilElement {
    }
    var HTMLOsButtonElement: {
        prototype: HTMLOsButtonElement;
        new (): HTMLOsButtonElement;
    };
    interface HTMLOsInputElement extends Components.OsInput, HTMLStencilElement {
    }
    var HTMLOsInputElement: {
        prototype: HTMLOsInputElement;
        new (): HTMLOsInputElement;
    };
    interface HTMLElementTagNameMap {
        "os-button": HTMLOsButtonElement;
        "os-input": HTMLOsInputElement;
    }
}
declare namespace LocalJSX {
    interface OsButton {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface OsInput {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface IntrinsicElements {
        "os-button": OsButton;
        "os-input": OsInput;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "os-button": LocalJSX.OsButton & JSXBase.HTMLAttributes<HTMLOsButtonElement>;
            "os-input": LocalJSX.OsInput & JSXBase.HTMLAttributes<HTMLOsInputElement>;
        }
    }
}