/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import "@js-temporal/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
