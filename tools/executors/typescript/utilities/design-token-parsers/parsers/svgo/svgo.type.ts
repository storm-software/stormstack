import { DefaultPlugin, PresetDefault } from 'svgo';
import type { default as SVGOV1 } from '../../types/svgo.v1';

export type DefaultPresetPluginsName = PresetDefault['name'];

export type DefaultPresetPluginsParams = PresetDefault['params'];

export type DefaultPresetOverride = {
  [P in DefaultPresetPluginsName]?: false | DefaultPresetPluginsParams;
};

export type PluginV2 = DefaultPlugin | DefaultPlugin['name'];
export type PluginV1 = SVGOV1.PluginConfig;
export type Plugins = Array<PluginV1> | Array<PluginV2>;

export const defaultPresetPlugins = [
  'removeDoctype',
  'removeXMLProcInst',
  'removeComments',
  'removeMetadata',
  'removeEditorsNSData',
  'cleanupAttrs',
  'mergeStyles',
  'inlineStyles',
  'minifyStyles',
  'cleanupIDs',
  'removeUselessDefs',
  'cleanupNumericValues',
  'convertColors',
  'removeUnknownsAndDefaults',
  'removeNonInheritableGroupAttrs',
  'removeUselessStrokeAndFill',
  'removeViewBox',
  'cleanupEnableBackground',
  'removeHiddenElems',
  'removeEmptyText',
  'convertShapeToPath',
  'convertEllipseToCircle',
  'moveElemsAttrsToGroup',
  'moveGroupAttrsToElems',
  'collapseGroups',
  'convertPathData',
  'convertTransform',
  'removeEmptyAttrs',
  'removeEmptyContainers',
  'mergePaths',
  'removeUnusedNS',
  'sortDefsChildren',
  'removeTitle',
  'removeDesc',
];
