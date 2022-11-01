"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs_extra_1 = require("fs-extra");
var util_1 = require("util");
var Path = require("path");
var api_extractor_1 = require("@microsoft/api-extractor");
var readline_1 = require("readline");
var qs_1 = require("qs");
var fs_1 = require("fs");
var execute = function (command) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)(command)];
            case 1:
                result = _b.sent();
                if (result === null || result === void 0 ? void 0 : result.stderr) {
                    console.error(result.stderr);
                    return [2 /*return*/, result.stderr];
                }
                return [2 /*return*/, undefined];
            case 2:
                e_1 = _b.sent();
                console.error(e_1);
                return [2 /*return*/, (_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _a !== void 0 ? _a : "Exception occurred while processing request. "];
            case 3: return [2 /*return*/];
        }
    });
}); };
var LIB_GENERATED_DIR = "__docs__";
var documentExecutor = function (options, context) { return __awaiter(void 0, void 0, void 0, function () {
    var result, _loop_1, _i, _a, _b, key, project, state_1, e_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                console.info("Executing \"document\" executor...");
                console.info("Options: ".concat(JSON.stringify(options, null, 2)));
                console.info("Current Directory: ".concat(__dirname));
                console.info("context: ".concat(JSON.stringify(context)));
                result = void 0;
                _loop_1 = function (key, project) {
                    var rootPath, docsPath_1, packagePath, distPath_1, input, output_1, lines_1, extractorResult;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!!key.endsWith("docs")) return [3 /*break*/, 10];
                                console.log("Begin documenting ".concat(key));
                                rootPath = context.root;
                                docsPath_1 = Path.join(rootPath, "docs", "ts-docs");
                                packagePath = Path.join(rootPath, project.root);
                                distPath_1 = Path.join(rootPath, "dist", project.root);
                                console.info("Processing project at path ".concat(packagePath));
                                console.info("Navigate to root directory.");
                                return [4 /*yield*/, execute(" cd \"".concat(rootPath, "\" "))];
                            case 1:
                                result = _d.sent();
                                console.info("Building project \"".concat(key, "\"..."));
                                return [4 /*yield*/, execute(" npx nx run ".concat(key, ":build "))];
                            case 2:
                                result = _d.sent();
                                if (result) {
                                    console.info("Error building project \"".concat(key, "\"..."));
                                    console.error(result);
                                    return [2 /*return*/, { value: { success: false } }];
                                }
                                console.info("Build succeeded.");
                                if (!(0, fs_extra_1.existsSync)(Path.join(packagePath, "tsconfig.json"))) return [3 /*break*/, 5];
                                input = (0, fs_1.createReadStream)(Path.join(packagePath, "tsconfig.json"));
                                output_1 = [];
                                lines_1 = (0, readline_1.createInterface)({
                                    input: input,
                                    crlfDelay: Infinity
                                });
                                lines_1.on("line", function (line) {
                                    output_1.push(line.includes('"../') ? line.replace('"../', '"../../') : line);
                                });
                                return [4 /*yield*/, new Promise(function (resolve) { return lines_1.once("close", resolve); })];
                            case 3:
                                _d.sent();
                                input.close();
                                return [4 /*yield*/, (0, fs_extra_1.writeFile)(Path.join(distPath_1, "tsconfig.json"), output_1.join("\n"))];
                            case 4:
                                _d.sent();
                                _d.label = 5;
                            case 5:
                                console.info("Creating generated directory - \"".concat(Path.join(distPath_1, LIB_GENERATED_DIR), "\"."));
                                return [4 /*yield*/, execute(" mkdir \"".concat(Path.join(distPath_1, LIB_GENERATED_DIR), "\" "))];
                            case 6:
                                result = _d.sent();
                                if (result) {
                                    console.error(result);
                                    return [2 /*return*/, { value: { success: false } }];
                                }
                                console.info("Directory successfully created.");
                                console.info("Creating generated directory - \"".concat(Path.join(distPath_1, LIB_GENERATED_DIR, "reports"), "\"."));
                                return [4 /*yield*/, execute(" mkdir \"".concat(Path.join(distPath_1, LIB_GENERATED_DIR, "reports"), "\" "))];
                            case 7:
                                result = _d.sent();
                                if (result) {
                                    console.error(result);
                                    return [2 /*return*/, { value: { success: false } }];
                                }
                                console.info("Directory successfully created.");
                                extractorResult = api_extractor_1.Extractor.invoke(api_extractor_1.ExtractorConfig.prepare({
                                    configObject: api_extractor_1.ExtractorConfig.loadFile(Path.join(rootPath, "docs", "config", "api-extractor.json")),
                                    configObjectFullPath: Path.join(rootPath, "docs", "config", "api-extractor.json"),
                                    projectFolderLookupToken: distPath_1,
                                    packageJsonFullPath: Path.join(distPath_1, "package.json")
                                }), {
                                    // Equivalent to the "--local" command-line parameter
                                    localBuild: true,
                                    // Equivalent to the "--verbose" command-line parameter
                                    showVerboseMessages: true
                                });
                                if (!extractorResult.succeeded) {
                                    console.error("API Extractor completed with ".concat(extractorResult.errorCount, " errors") +
                                        " and ".concat(extractorResult.warningCount, " warnings"));
                                    return [2 /*return*/, { value: { success: false } }];
                                }
                                console.info("Navigate to dist directory.");
                                return [4 /*yield*/, execute(" cd \"".concat(distPath_1, "\" "))];
                            case 8:
                                result = _d.sent();
                                return [4 /*yield*/, execute(" npx api-documenter markdown -i \"".concat(Path.join(distPath_1, LIB_GENERATED_DIR), "\" -o \"").concat(Path.join(distPath_1, LIB_GENERATED_DIR, "api"), "\" "))];
                            case 9:
                                result = _d.sent();
                                if (result) {
                                    console.error(result);
                                    return [2 /*return*/, { value: { success: false } }];
                                }
                                console.info("Generated markdown.");
                                (0, fs_1.readdir)(Path.join(distPath_1, LIB_GENERATED_DIR, "api"), function (err, files) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _loop_2, _i, files_1, docFile;
                                    return __generator(this, function (_a) {
                                        !files || !Array.isArray(files) || files.length === 0
                                            ? console.info("No markdown doc files read")
                                            : console.info("Formatting markdown doc files");
                                        _loop_2 = function (docFile) {
                                            try {
                                                var _b = (0, qs_1.parse)(docFile), id_1 = _b.name, ext = _b.ext;
                                                if (ext !== ".md") {
                                                    return "continue";
                                                }
                                                var docPath = Path.join(Path.join(distPath_1, LIB_GENERATED_DIR, "api"), docFile);
                                                var input_1 = (0, fs_1.createReadStream)(docPath);
                                                var output_2 = [];
                                                var lines_2 = (0, readline_1.createInterface)({
                                                    input: input_1,
                                                    crlfDelay: Infinity
                                                });
                                                var title_1 = "";
                                                lines_2.on("line", function (line) {
                                                    var skip = false;
                                                    if (!title_1) {
                                                        var titleLine = line.match(/## (.*)/);
                                                        if (titleLine) {
                                                            title_1 = titleLine[1];
                                                        }
                                                    }
                                                    var homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/);
                                                    if (homeLink) {
                                                        // Skip the breadcrumb for the toplevel index file.
                                                        if (id_1 !== "broadridge-fxl") {
                                                            output_2.push(homeLink[1]);
                                                        }
                                                        skip = true;
                                                    }
                                                    // See issue #4. api-documenter expects \| to escape table
                                                    // column delimiters, but docusaurus uses a markdown processor
                                                    // that doesn't support this. Replace with an escape sequence
                                                    // that renders |.
                                                    if (line.startsWith("|")) {
                                                        line = line.replace(/\\\|/g, "&#124;");
                                                    }
                                                    if (!skip) {
                                                        output_2.push(line);
                                                    }
                                                });
                                                new Promise(function (resolve) { return lines_2.once("close", resolve); }).then(function () {
                                                    input_1.close();
                                                    var header = [
                                                        "---",
                                                        "id: ".concat(id_1),
                                                        "title: ".concat(title_1),
                                                        "hide_title: true",
                                                        "---",
                                                    ];
                                                    (0, fs_extra_1.writeFile)(Path.join(docsPath_1, key), header.concat(output_2).join("\n"));
                                                });
                                            }
                                            catch (err) {
                                                console.error("Could not process ".concat(docFile, ": ").concat(err));
                                            }
                                        };
                                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                                            docFile = files_1[_i];
                                            _loop_2(docFile);
                                        }
                                        return [2 /*return*/];
                                    });
                                }); });
                                /* console.info(` xcopy "${fromPath}" "${toPath}" `);
                                  result = await execute(` xcopy "${fromPath}" "${toPath}" `);
                                  if (result) {
                                    console.error(result);
                        
                                    return { success: false };
                                  }
                                
                        
                               result = await execute(
                                  ` xcopy "${Path.join(
                                    packagePath,
                                    LIB_DOCS_DIR,
                                    "api"
                                  )}" "${docsPath}" /O /X /E /H /K `
                                );
                                if (result) {
                                  console.error(result);
                        
                                  return { success: false };
                                }*/
                                console.info("Documents successfully generated for ".concat(key, "!"));
                                _d.label = 10;
                            case 10: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = Object.entries(context.workspace.projects);
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                _b = _a[_i], key = _b[0], project = _b[1];
                return [5 /*yield**/, _loop_1(key, project)];
            case 2:
                state_1 = _c.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, { success: !result }];
            case 5:
                e_2 = _c.sent();
                console.error(e_2);
                return [2 /*return*/, { success: false }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports["default"] = documentExecutor;
