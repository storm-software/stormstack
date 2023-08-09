let schemas;
try {
  schemas = require(".storm/zod/input/index");
} catch {
  /* empty */
}

module.exports = schemas && {
  ...schemas,
};
