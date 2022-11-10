/*
 * Copyright 2018 OpenAPI-Generator Contributors (https://openapi-generator.tech)
 * Copyright 2018 SmartBear Software
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package opensystem.redux.query;

import org.openapitools.codegen.*;
import org.openapitools.codegen.model.*;
import org.openapitools.codegen.languages.*;
import io.swagger.models.properties.*;
import io.swagger.v3.parser.util.SchemaTypeUtil;

import java.util.*;
import java.io.File;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.Ticker;
import com.google.common.base.CaseFormat;
import com.google.common.collect.ImmutableMap;
import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.Mustache.Compiler;
import com.samskivert.mustache.Mustache.Lambda;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.openapitools.codegen.CodegenDiscriminator.MappedModel;
import org.openapitools.codegen.api.TemplatingEngineAdapter;
import org.openapitools.codegen.config.GlobalSettings;
import org.openapitools.codegen.examples.ExampleGenerator;
import org.openapitools.codegen.languages.RustServerCodegen;
import org.openapitools.codegen.meta.FeatureSet;
import org.openapitools.codegen.meta.GeneratorMetadata;
import org.openapitools.codegen.meta.Stability;
import org.openapitools.codegen.meta.features.*;
import org.openapitools.codegen.model.ModelMap;
import org.openapitools.codegen.model.ModelsMap;
import org.openapitools.codegen.model.OperationsMap;
import org.openapitools.codegen.serializer.SerializerUtils;
import org.openapitools.codegen.templating.MustacheEngineAdapter;
import org.openapitools.codegen.templating.mustache.*;
import org.openapitools.codegen.utils.CamelizeOption;
import org.openapitools.codegen.utils.ModelUtils;
import org.openapitools.codegen.utils.OneOfImplementorAdditionalData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentSkipListSet;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import io.swagger.v3.core.util.Json;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.callbacks.Callback;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.headers.Header;
import io.swagger.v3.oas.models.media.*;
import io.swagger.v3.oas.models.parameters.*;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.servers.ServerVariable;
import io.swagger.v3.parser.util.SchemaTypeUtil;

import static org.openapitools.codegen.utils.OnceLogger.once;
import static org.openapitools.codegen.utils.StringUtils.*;
import com.google.common.collect.Sets;
import com.github.curiousoddman.rgxgen.*;
import com.github.curiousoddman.rgxgen.config.RgxGenProperties;
import com.github.curiousoddman.rgxgen.config.RgxGenOption;

public class OpenSystemReduxQueryGenerator extends AbstractTypeScriptClientCodegen {

    public static final String NPM_REPOSITORY = "npmRepository";
    public static final String WITH_INTERFACES = "withInterfaces";
    public static final String USE_SINGLE_REQUEST_PARAMETER = "useSingleRequestParameter";

    protected String npmRepository = null;
    private boolean useSingleRequestParameter = true;
    protected boolean addedApiIndex = false;
    protected boolean addedModelIndex = false;

    public OpenSystemReduxQueryGenerator() {
        super();

        // clear import mapping (from default generator) as TS does not use it
        // at the moment
        importMapping.clear();

        supportsMultipleInheritance = true;

        outputFolder = "generated-code/open-system-redux-query";
        embeddedTemplateDir = templateDir = "open-system-redux-query";

        this.apiPackage = "src" + File.separator +"apis";
        this.modelPackage = "src" + File.separator + "models";
        this.apiTemplateFiles.put("apis.mustache", ".ts");
        this.modelTemplateFiles.put("models.mustache", ".ts");
        this.addExtraReservedWords();

        typeMapping.put("date", "Date");
        typeMapping.put("DateTime", "Date");

        supportModelPropertyNaming(CodegenConstants.MODEL_PROPERTY_NAMING_TYPE.camelCase);
        this.cliOptions.add(new CliOption(NPM_REPOSITORY, "Use this property to set an url your private npmRepo in the package.json"));
        this.cliOptions.add(new CliOption(WITH_INTERFACES, "Setting this property to true will generate interfaces next to the default class implementations.", SchemaTypeUtil.BOOLEAN_TYPE).defaultValue(Boolean.FALSE.toString()));
        this.cliOptions.add(new CliOption(USE_SINGLE_REQUEST_PARAMETER, "Setting this property to true will generate functions with a single argument containing all API endpoint parameters instead of one argument per parameter.", SchemaTypeUtil.BOOLEAN_TYPE).defaultValue(Boolean.TRUE.toString()));
    }

    @Override
    public String getName() {
        return "open-system-redux-query";
    }

    @Override
    public String getHelp() {
        return "Generates a TypeScript client library using redux-query API (beta).";
    }

    public String getNpmRepository() {
        return npmRepository;
    }

    public void setNpmRepository(String npmRepository) {
        this.npmRepository = npmRepository;
    }

    @Override
    public void processOpts() {
        super.processOpts();
        additionalProperties.put("isOriginalModelPropertyNaming", getModelPropertyNaming() == CodegenConstants.MODEL_PROPERTY_NAMING_TYPE.original);
        additionalProperties.put("modelPropertyNaming", getModelPropertyNaming().name());
        supportingFiles.add(new SupportingFile("index.mustache", "src", "index.ts"));
        supportingFiles.add(new SupportingFile("runtime.mustache", "src", "runtime.ts"));
        supportingFiles.add(new SupportingFile("tsconfig.mustache", "", "tsconfig.json"));
        supportingFiles.add(new SupportingFile("gitignore", "", ".gitignore"));

        if (additionalProperties.containsKey(USE_SINGLE_REQUEST_PARAMETER)) {
            this.setUseSingleRequestParameter(convertPropertyToBoolean(USE_SINGLE_REQUEST_PARAMETER));
        }
        writePropertyBack(USE_SINGLE_REQUEST_PARAMETER, getUseSingleRequestParameter());

        if (additionalProperties.containsKey(NPM_NAME)) {
            addNpmPackageGeneration();
        }
    }

    @Override
    public String getTypeDeclaration(Schema p) {
        if (ModelUtils.isFileSchema(p)) {
            return "Blob";
        } else if (ModelUtils.isBinarySchema(p)) {
            return "Blob";
        }
        return super.getTypeDeclaration(p);
    }

    @Override
    protected void addAdditionPropertiesToCodeGenModel(CodegenModel codegenModel, Schema schema) {
        codegenModel.additionalPropertiesType = getTypeDeclaration(getAdditionalProperties(schema));
        addImport(codegenModel, codegenModel.additionalPropertiesType);
    }

    @Override
    public ModelsMap postProcessModels(ModelsMap objs) {
        List<ModelMap> models = postProcessModelsEnum(objs).getModels();

        // process enum in models
        for (ModelMap mo : models) {
            CodegenModel cm = mo.getModel();
            cm.imports = new TreeSet<>(cm.imports);
            // name enum with model name, e.g. StatusEnum => Pet.StatusEnum
            for (CodegenProperty var : cm.vars) {
                if (Boolean.TRUE.equals(var.isEnum)) {
                    // behaviour for enum names is specific for Typescript Fetch, not using namespaces
                    var.datatypeWithEnum = var.datatypeWithEnum.replace(var.enumName, cm.classname + var.enumName);
                }
            }
            if (cm.parent != null) {
                for (CodegenProperty var : cm.allVars) {
                    if (Boolean.TRUE.equals(var.isEnum)) {
                        var.datatypeWithEnum = var.datatypeWithEnum
                                .replace(var.enumName, cm.classname + var.enumName);
                    }
                }
            }
            if (!cm.oneOf.isEmpty()) {
                // For oneOfs only import $refs within the oneOf
                TreeSet<String> oneOfRefs = new TreeSet<>();
                for (String im : cm.imports) {
                    if (cm.oneOf.contains(im)) {
                        oneOfRefs.add(im);
                    }
                }
                cm.imports = oneOfRefs;
            }
        }

        return objs;
    }

    @Override
    public Map<String, ModelsMap> postProcessAllModels(Map<String, ModelsMap> objs) {
        Map<String, ModelsMap> result = super.postProcessAllModels(objs);
        for (ModelsMap entry : result.values()) {
            for (ModelMap model : entry.getModels()) {
                CodegenModel codegenModel = model.getModel();
                model.put("hasImports", codegenModel.imports.size() > 0);
            }
        }
        return result;
    }

    private void addNpmPackageGeneration() {

        if (additionalProperties.containsKey(NPM_REPOSITORY)) {
            this.setNpmRepository(additionalProperties.get(NPM_REPOSITORY).toString());
        }

        //Files for building our lib
        supportingFiles.add(new SupportingFile("README.mustache", "", "README.md"));
        supportingFiles.add(new SupportingFile("package.mustache", "", "package.json"));
        supportingFiles.add(new SupportingFile("npmignore.mustache", "", ".npmignore"));
    }

    @Override
    public OperationsMap postProcessOperationsWithModels(OperationsMap operations, List<ModelMap> allModels) {
        // Add supporting file only if we plan to generate files in /apis
        if (!operations.isEmpty() && !addedApiIndex) {
            addedApiIndex = true;
            supportingFiles.add(new SupportingFile("apis.index.mustache", apiPackage().replace('.', File.separatorChar), "index.ts"));
        }

        // Add supporting file only if we plan to generate files in /models
        if (!allModels.isEmpty() && !addedModelIndex) {
            addedModelIndex = true;
            supportingFiles.add(new SupportingFile("models.index.mustache", modelPackage().replace('.', File.separatorChar), "index.ts"));
        }

        this.addOperationModelImportInformation(operations);
        this.updateOperationParameterEnumInformation(operations);
        this.addOperationObjectResponseInformation(operations);
        return operations;
    }

    private void addOperationModelImportInformation(OperationsMap operations) {
        // This method will add extra information to the operations.imports array.
        // The api template uses this information to import all the required
        // models for a given operation.
        List<Map<String, String>> imports = operations.getImports();
        for (Map<String, String> im : imports) {
            String[] parts = im.get("import").replace(modelPackage() + ".", "").split("( [|&] )|[<>]");
            for (String s : parts) {
                if (needToImport(s)) {
                    im.put("filename", im.get("import"));
                    im.put("className", s);
                }
            }
        }
    }

    private void updateOperationParameterEnumInformation(OperationsMap operations) {
        // This method will add extra information as to whether or not we have enums and
        // update their names with the operation.id prefixed.
        boolean hasEnum = false;
        for (CodegenOperation op : operations.getOperations().getOperation()) {
            for (CodegenParameter param : op.allParams) {
                if (Boolean.TRUE.equals(param.isEnum)) {
                    hasEnum = true;
                    param.datatypeWithEnum = param.datatypeWithEnum
                            .replace(param.enumName, op.operationIdCamelCase + param.enumName);
                }
            }
        }

        operations.put("hasEnums", hasEnum);
    }

    private void addOperationObjectResponseInformation(OperationsMap operations) {
        // This method will modify the information on the operations' return type.
        // The api template uses this information to know when to return a text
        // response for a given simple response operation.
        for (CodegenOperation op : operations.getOperations().getOperation()) {
            if("object".equals(op.returnType)) {
                op.isMap = true;
                op.returnSimpleType = false;
            }
        }
    }

    private void addExtraReservedWords() {
        this.reservedWords.add("BASE_PATH");
        this.reservedWords.add("BaseAPI");
        this.reservedWords.add("RequiredError");
        this.reservedWords.add("COLLECTION_FORMATS");
//        this.reservedWords.add("FetchAPI");
        this.reservedWords.add("ConfigurationParameters");
        this.reservedWords.add("Configuration");
        this.reservedWords.add("configuration");
        this.reservedWords.add("HTTPMethod");
        this.reservedWords.add("HTTPHeaders");
        this.reservedWords.add("HTTPQuery");
        this.reservedWords.add("HTTPBody");
        this.reservedWords.add("ModelPropertyNaming");
//        this.reservedWords.add("FetchParams");
        this.reservedWords.add("RequestOpts");
        this.reservedWords.add("exists");
        this.reservedWords.add("RequestContext");
        this.reservedWords.add("ResponseContext");
        this.reservedWords.add("Middleware");
        this.reservedWords.add("ApiResponse");
        this.reservedWords.add("ResponseTransformer");
        this.reservedWords.add("JSONApiResponse");
        this.reservedWords.add("VoidApiResponse");
        this.reservedWords.add("BlobApiResponse");
        this.reservedWords.add("TextApiResponse");
    }

    private boolean getUseSingleRequestParameter() {
        return useSingleRequestParameter;
    }

    private void setUseSingleRequestParameter(boolean useSingleRequestParameter) {
        this.useSingleRequestParameter = useSingleRequestParameter;
    }
}
