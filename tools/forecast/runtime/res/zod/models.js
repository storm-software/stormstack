let schemas;
try {
  schemas = require(".storm/zod/models/index");
} catch {
  /* empty */
}

module.exports = schemas && {
  ...schemas,
};
