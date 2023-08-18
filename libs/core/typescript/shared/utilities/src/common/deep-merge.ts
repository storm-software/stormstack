import {
  isFunction,
  isMergeableObject,
  propertyIsOnObject,
  propertyIsUnsafe,
} from "./type-checks";

const emptyTarget = val => {
  return Array.isArray(val) ? [] : {};
};

const cloneUnlessOtherwiseSpecified = (value, options) => {
  return options.clone !== false && options.isMergeableObject(value)
    ? deepMerge(emptyTarget(value), value, options)
    : value;
};

const defaultArrayMerge = (target, source, options) => {
  return target.concat(source).map(element => {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
};

const getMergeFunction = (key, options) => {
  if (!options.customMerge) {
    return deepMerge;
  }
  const customMerge = options.customMerge(key);
  return isFunction(customMerge) ? customMerge : deepMerge;
};

const getKeys = target => {
  return Object.keys(target).concat(
    (Object.getOwnPropertySymbols
      ? Object.getOwnPropertySymbols(target).filter(symbol => {
          return Object.propertyIsEnumerable.call(target, symbol);
        })
      : []) as unknown as string[]
  );
};

export const mergeObject = (target, source, options) => {
  const destination = {};
  if (options.isMergeableObject(target)) {
    getKeys(target).forEach(key => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  getKeys(source).forEach(key => {
    if (propertyIsUnsafe(target, key)) {
      return;
    }

    if (
      propertyIsOnObject(target, key) &&
      options.isMergeableObject(source[key])
    ) {
      destination[key] = getMergeFunction(key, options)(
        target[key],
        source[key],
        options
      );
    } else {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    }
  });
  return destination;
};

export const deepMerge = (target: any, source: any, options: any = {}) => {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || isMergeableObject;
  // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
  // implementations can use it. The caller may not replace it.
  options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
};

deepMerge.all = function deepMergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error("first argument should be an array");
  }

  return array.reduce((prev, next) => {
    return deepMerge(prev, next, options);
  }, {});
};
