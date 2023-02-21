package opensystem.dotnet.server;

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
import org.openapitools.codegen.utils.ModelUtils;
import org.openapitools.codegen.utils.OneOfImplementorAdditionalData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.*;
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
import com.samskivert.mustache.Mustache;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.parser.util.SchemaTypeUtil;
import org.openapitools.codegen.*;
import org.openapitools.codegen.meta.features.*;
import org.openapitools.codegen.model.ModelMap;
import org.openapitools.codegen.model.OperationMap;
import org.openapitools.codegen.model.OperationsMap;
import org.openapitools.codegen.utils.ModelUtils;
import org.openapitools.codegen.utils.URLPathUtils;


import java.io.File;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static java.util.UUID.randomUUID;

public class OpenSystemDotnetServerGenerator extends AbstractCSharpCodegen {

    public static final String DOMAIN_NAME = "domainName";
    public static final String CAPITAL_DOMAIN_NAME = "capitalDomainName";
    public static final String LOWER_DOMAIN_NAME = "lowerDomainName";
    public static final String PROJECT_NAME = "projectName";
    public static final String URL_ROOT = "urlRoot";
    public static final String SERVICE_NAME = "serviceName";
    public static final String FULL_SERVICE_NAME = "fullServiceName";
    public static final String SPEC_JSON_FILE = "specJsonFile";
    public static final String SOURCE_ROOT = "sourceRoot";
    public static final String DOCKER_TAG = "dockerTag";

    public static final String USE_SWASHBUCKLE = "useSwashbuckle";
    public static final String MODEL_POCOMODE = "pocoModels";
    public static final String USE_MODEL_SEPERATEPROJECT = "useSeperateModelProject";
    public static final String ASPNET_CORE_VERSION = "aspnetCoreVersion";
    public static final String SWASHBUCKLE_VERSION = "swashbuckleVersion";
    public static final String CLASS_MODIFIER = "classModifier";
    public static final String OPERATION_MODIFIER = "operationModifier";
    public static final String OPERATION_IS_ASYNC = "operationIsAsync";
    public static final String OPERATION_RESULT_TASK = "operationResultTask";
    public static final String GENERATE_BODY = "generateBody";
    public static final String BUILD_TARGET = "buildTarget";
    public static final String MODEL_CLASS_MODIFIER = "modelClassModifier";
    public static final String TARGET_FRAMEWORK = "targetFramework";

    public static final String PROJECT_SDK = "projectSdk";
    public static final String SDK_WEB = "Microsoft.NET.Sdk.Web";
    public static final String SDK_LIB = "Microsoft.NET.Sdk";
    public static final String COMPATIBILITY_VERSION = "compatibilityVersion";
    public static final String IS_LIBRARY = "isLibrary";
    public static final String USE_FRAMEWORK_REFERENCE = "useFrameworkReference";
    public static final String USE_NEWTONSOFT = "useNewtonsoft";
    public static final String USE_DEFAULT_ROUTING = "useDefaultRouting";
    public static final String NEWTONSOFT_VERSION = "newtonsoftVersion";

    private String packageGuid = "{" + randomUUID().toString().toUpperCase(Locale.ROOT) + "}";
    private String userSecretsGuid = randomUUID().toString();

    protected final Logger LOGGER = LoggerFactory.getLogger(OpenSystemDotnetServerGenerator.class);

    private boolean useSwashbuckle = true;
    private boolean pocoModels = false;
    private boolean useSeperateModelProject = false;
    protected boolean useDateTimeOffsetFlag = true;
    protected int serverPort = 8080;
    protected String serverHost = "0.0.0.0";
    protected CliOption swashbuckleVersion = new CliOption(SWASHBUCKLE_VERSION, "Swashbuckle version: 3.0.0 (deprecated), 4.0.0 (deprecated), 5.0.0 (deprecated), 6.4.0");
    protected CliOption aspnetCoreVersion = new CliOption(ASPNET_CORE_VERSION, "ASP.NET Core version: 6.0, 5.0, 3.1, 3.0, 2.2, 2.1, 2.0 (deprecated)");
    private CliOption classModifier = new CliOption(CLASS_MODIFIER, "Class Modifier for controller classes: Empty string or abstract.");
    private CliOption operationModifier = new CliOption(OPERATION_MODIFIER, "Operation Modifier can be virtual or abstract");
    private CliOption modelClassModifier = new CliOption(MODEL_CLASS_MODIFIER, "Model Class Modifier can be nothing or partial");
    private boolean generateBody = true;
    private CliOption buildTarget = new CliOption("buildTarget", "Target to build an application or library");
    private String projectSdk = SDK_WEB;
    private String compatibilityVersion = "Version_2_2";
    private boolean operationIsAsync = false;
    private boolean operationResultTask = false;
    private boolean isLibrary = false;
    private boolean useFrameworkReference = false;
    private boolean useNewtonsoft = false;
    private boolean useDefaultRouting = true;
    private String newtonsoftVersion = "3.0.0";

   // The above code is creating a new CliOption object.

   private String domainName = "shared";
   private String capitalDomainName = "Shared";
   private String lowerDomainName = "shared";
   private String projectName = null;
   private String urlRoot = null;
   private String serviceName = null;
   private String fullServiceName = null;
   private String specJsonFile = null;
   private String sourceRoot = null;
   private String dockerTag = null;

    public OpenSystemDotnetServerGenerator() {
        super();

        // TODO: AspnetCore community review
        modifyFeatureSet(features -> features
                .includeDocumentationFeatures(DocumentationFeature.Readme)
                .excludeWireFormatFeatures(WireFormatFeature.PROTOBUF)
                .includeSecurityFeatures(
                        SecurityFeature.ApiKey,
                        SecurityFeature.BasicAuth,
                        SecurityFeature.BearerToken
                )
                .excludeSecurityFeatures(
                        SecurityFeature.OpenIDConnect,
                        SecurityFeature.OAuth2_Password,
                        SecurityFeature.OAuth2_AuthorizationCode,
                        SecurityFeature.OAuth2_ClientCredentials,
                        SecurityFeature.OAuth2_Implicit
                )
                .excludeGlobalFeatures(
                        GlobalFeature.XMLStructureDefinitions,
                        GlobalFeature.Callbacks,
                        GlobalFeature.LinkObjects,
                        GlobalFeature.ParameterStyling,
                        GlobalFeature.MultiServer
                )
                .includeSchemaSupportFeatures(
                        SchemaSupportFeature.Polymorphism
                )
                .includeParameterFeatures(
                        ParameterFeature.Cookie
                )
        );

        outputFolder = "generated-code" + File.separator + getName();

        // modelTemplateFiles.put("model.mustache", ".cs");
        apiTemplateFiles.put("controller.mustache", ".cs");

        // contextually reserved words
        // NOTE: C# uses camel cased reserved words, while models are title cased. We don't want lowercase comparisons.
        reservedWords.addAll(
                Arrays.asList("var", "async", "await", "dynamic", "yield")
        );

        cliOptions.clear();

        typeMapping.put("boolean", "bool");
        typeMapping.put("integer", "int");
        typeMapping.put("float", "float");
        typeMapping.put("long", "long");
        typeMapping.put("double", "double");
        typeMapping.put("number", "decimal");
        typeMapping.put("UUID", "Guid");
        typeMapping.put("URI", "string");

        setSupportNullable(Boolean.TRUE);

        // CLI options
        addOption(CodegenConstants.PACKAGE_DESCRIPTION,
                CodegenConstants.PACKAGE_DESCRIPTION_DESC,
                packageDescription);

        addOption(CodegenConstants.LICENSE_URL,
                CodegenConstants.LICENSE_URL_DESC,
                licenseUrl);

        addOption(CodegenConstants.LICENSE_NAME,
                CodegenConstants.LICENSE_NAME_DESC,
                licenseName);

        addOption(CodegenConstants.PACKAGE_COPYRIGHT,
                CodegenConstants.PACKAGE_COPYRIGHT_DESC,
                packageCopyright);

        addOption(CodegenConstants.PACKAGE_AUTHORS,
                CodegenConstants.PACKAGE_AUTHORS_DESC,
                packageAuthors);

        addOption(CodegenConstants.PACKAGE_TITLE,
                CodegenConstants.PACKAGE_TITLE_DESC,
                packageTitle);

        addOption(CodegenConstants.PACKAGE_NAME,
                "C# package name (convention: Title.Case).",
                packageName);

        addOption(CodegenConstants.PACKAGE_VERSION,
                "C# package version.",
                packageVersion);

        addOption(CodegenConstants.OPTIONAL_PROJECT_GUID,
                CodegenConstants.OPTIONAL_PROJECT_GUID_DESC,
                null);

        addOption(CodegenConstants.SOURCE_FOLDER,
                CodegenConstants.SOURCE_FOLDER_DESC,
                sourceFolder);

        addOption(COMPATIBILITY_VERSION, "ASP.Net Core CompatibilityVersion", compatibilityVersion);

        aspnetCoreVersion.addEnum("2.0", "ASP.NET Core 2.0");
        aspnetCoreVersion.addEnum("2.1", "ASP.NET Core 2.1");
        aspnetCoreVersion.addEnum("2.2", "ASP.NET Core 2.2");
        aspnetCoreVersion.addEnum("3.0", "ASP.NET Core 3.0");
        aspnetCoreVersion.addEnum("3.1", "ASP.NET Core 3.1");
        aspnetCoreVersion.addEnum("5.0", "ASP.NET Core 5.0");
        aspnetCoreVersion.addEnum("6.0", "ASP.NET Core 6.0");
        aspnetCoreVersion.addEnum("7.0", "ASP.NET Core 7.0");
        aspnetCoreVersion.setDefault("7.0");
        aspnetCoreVersion.setOptValue(aspnetCoreVersion.getDefault());
        cliOptions.add(aspnetCoreVersion);

        swashbuckleVersion.addEnum("3.0.0", "Swashbuckle 3.0.0");
        swashbuckleVersion.addEnum("4.0.0", "Swashbuckle 4.0.0");
        swashbuckleVersion.addEnum("5.0.0", "Swashbuckle 5.0.0");
        swashbuckleVersion.addEnum("6.4.0", "Swashbuckle 6.4.0");
        swashbuckleVersion.setDefault("6.4.0");
        swashbuckleVersion.setOptValue(swashbuckleVersion.getDefault());
        cliOptions.add(swashbuckleVersion);

        // CLI Switches
        addSwitch(CodegenConstants.NULLABLE_REFERENCE_TYPES,
                CodegenConstants.NULLABLE_REFERENCE_TYPES_DESC,
                this.nullReferenceTypesFlag);

        addSwitch(CodegenConstants.SORT_PARAMS_BY_REQUIRED_FLAG,
                CodegenConstants.SORT_PARAMS_BY_REQUIRED_FLAG_DESC,
                sortParamsByRequiredFlag);

        addSwitch(CodegenConstants.USE_DATETIME_OFFSET,
                CodegenConstants.USE_DATETIME_OFFSET_DESC,
                useDateTimeOffsetFlag);

        if (useDateTimeOffsetFlag) {
          typeMapping.put("DateTime", "DateTimeOffset");
          typeMapping.put("date", "DateTimeOffset");
        } else {
          typeMapping.put("DateTime", "DateTime");
          typeMapping.put("date", "DateTime");
        }

        addSwitch(CodegenConstants.USE_COLLECTION,
                CodegenConstants.USE_COLLECTION_DESC,
                useCollection);

        addSwitch(CodegenConstants.RETURN_ICOLLECTION,
                CodegenConstants.RETURN_ICOLLECTION_DESC,
                returnICollection);

        addSwitch(USE_SWASHBUCKLE,
                "Uses the Swashbuckle.AspNetCore NuGet package for documentation.",
                useSwashbuckle);

        addSwitch(MODEL_POCOMODE,
                "Build POCO Models",
                pocoModels);

        addSwitch(USE_MODEL_SEPERATEPROJECT,
                "Create a seperate project for models",
                useSeperateModelProject);

        addSwitch(IS_LIBRARY,
                "Is the build a library",
                isLibrary);

        addSwitch(USE_FRAMEWORK_REFERENCE,
                "Use frameworkReference for ASP.NET Core 3.0+ and PackageReference ASP.NET Core 2.2 or earlier.",
                useFrameworkReference);

        addSwitch(USE_NEWTONSOFT,
                "Uses the Newtonsoft JSON library.",
                useNewtonsoft);

        addOption(NEWTONSOFT_VERSION,
                "Version for Microsoft.AspNetCore.Mvc.NewtonsoftJson for ASP.NET Core 3.0+",
                newtonsoftVersion);

        addSwitch(USE_DEFAULT_ROUTING,
                "Use default routing for the ASP.NET Core version.",
                useDefaultRouting);

        addOption(CodegenConstants.ENUM_NAME_SUFFIX,
                CodegenConstants.ENUM_NAME_SUFFIX_DESC,
                enumNameSuffix);

        addOption(CodegenConstants.ENUM_VALUE_SUFFIX,
                "Suffix that will be appended to all enum values.",
                enumValueSuffix);

        classModifier.addEnum("", "Keep class default with no modifier");
        classModifier.addEnum("abstract", "Make class abstract");
        classModifier.addEnum("sealed", "Make class sealed");
        classModifier.setDefault("sealed");
        classModifier.setOptValue(classModifier.getDefault());
        addOption(classModifier.getOpt(), classModifier.getDescription(), classModifier.getOptValue());

        operationModifier.addEnum("", "Keep method default with no modifier");
        operationModifier.addEnum("virtual", "Keep method virtual");
        operationModifier.addEnum("abstract", "Make method abstract");
        operationModifier.setDefault("");
        operationModifier.setOptValue(operationModifier.getDefault());
        cliOptions.add(operationModifier);

        buildTarget.addEnum("program", "Generate code for a standalone server");
        buildTarget.addEnum("library", "Generate code for a server abstract class library");
        buildTarget.setDefault("program");
        buildTarget.setOptValue(buildTarget.getDefault());
        cliOptions.add(buildTarget);

        addSwitch(GENERATE_BODY,
                "Generates method body.",
                generateBody);

        addSwitch(OPERATION_IS_ASYNC,
                "Set methods to async or sync (default).",
                operationIsAsync);

        addSwitch(OPERATION_RESULT_TASK,
                "Set methods result to Task<>.",
                operationResultTask);

        modelClassModifier.setType("String");
        modelClassModifier.addEnum("", "Keep model class default with no modifier");
        modelClassModifier.addEnum("partial", "Make model class partial");
        modelClassModifier.setDefault("");
        modelClassModifier.setOptValue(modelClassModifier.getDefault());
        addOption(modelClassModifier.getOpt(), modelClassModifier.getDescription(), modelClassModifier.getOptValue());
    }

    @Override
    public CodegenType getTag() {
        return CodegenType.SERVER;
    }

    @Override
    public String getName() {
        return "open-system-dotnet-server";
    }

    @Override
    public String getHelp() {
        return "Generates an ASP.NET Core Web API server.";
    }

     @Override
    public String templateDir() {
        return "C:\\Development\\open-system\\tools\\openapi\\dotnet-server\\src\\main\\resources\\open-system-dotnet-server";
    }

    @Override
    public String embeddedTemplateDir() {
        return "C:\\Development\\open-system\\tools\\openapi\\dotnet-server\\src\\main\\resources\\open-system-dotnet-server";
    }

    /*@Override
    public String getModelNameSuffix() {
        return "DTO";
    }*/

    /*@Override
    public String modelPackage() {
        return "BFXL.Libs.Shared.Server.DTO";
    }*/

    @Override
    public boolean isEnablePostProcessFile() {
        return true;
    }

    @Override
    public Boolean getLegacyDiscriminatorBehavior() {
        return false;
    }

    @Override
    public void preprocessOpenAPI(OpenAPI openAPI) {
        super.preprocessOpenAPI(openAPI);
        URL url = URLPathUtils.getServerURL(openAPI, serverVariableOverrides());
        additionalProperties.put("serverHost", url.getHost());
        additionalProperties.put("serverPort", URLPathUtils.getPort(url, 8080));
    }

    @Override
    public void processOpts() {
        super.processOpts();

        if (additionalProperties.containsKey(CodegenConstants.OPTIONAL_PROJECT_GUID)) {
            setPackageGuid((String) additionalProperties.get(CodegenConstants.OPTIONAL_PROJECT_GUID));
        }
        additionalProperties.put("packageGuid", packageGuid);

        if (!additionalProperties.containsKey("packageGuid")) {
            additionalProperties.put("packageGuid", packageGuid);
        } else {
            packageGuid = (String) additionalProperties.get("packageGuid");
        }

        if (!additionalProperties.containsKey("userSecretsGuid")) {
            additionalProperties.put("userSecretsGuid", userSecretsGuid);
        } else {
            userSecretsGuid = (String) additionalProperties.get("userSecretsGuid");
        }

        if (!additionalProperties.containsKey(NEWTONSOFT_VERSION)) {
            additionalProperties.put(NEWTONSOFT_VERSION, newtonsoftVersion);
        } else {
            newtonsoftVersion = (String) additionalProperties.get(NEWTONSOFT_VERSION);
        }

        // Check for the modifiers etc.
        // The order of the checks is important.
        setDomainName();
        setProjectName();
        setUrlRoot();
        setServiceName();
        setFullServiceName();
        setSpecJsonFile();
        setSourceRoot();
        setDockerTag();
        setBuildTarget();
        setClassModifier();
        setOperationModifier();
        setModelClassModifier();
        setPocoModels();
        setUseSeperateModelProject();
        setUseSwashbuckle();
        setOperationIsAsync();

        // Check for class modifier if not present set the default value.
        additionalProperties.put(PROJECT_SDK, projectSdk);

        // additionalProperties.put("dockerTag", packageName.toLowerCase(Locale.ROOT));

        if (!additionalProperties.containsKey(CodegenConstants.API_PACKAGE)) {
            apiPackage = packageName + ".Controllers";
            additionalProperties.put(CodegenConstants.API_PACKAGE, apiPackage);
        }

       // String packageFolder = sourceFolder + File.separator + packageName;

        // determine the ASP.NET core version setting
        setAspNetCoreVersion(/*packageFolder*/ "");
        setSwashbuckleVersion();
        setIsFramework();
        setUseNewtonsoft();
        setUseEndpointRouting();

        supportingFiles.add(new SupportingFile("build.sh.mustache", "", "build.sh"));
        supportingFiles.add(new SupportingFile("build.bat.mustache", "", "build.bat"));
        supportingFiles.add(new SupportingFile("project.json.mustache", "", "project.json"));
        supportingFiles.add(new SupportingFile("README.mustache", "", "README.md"));
        // supportingFiles.add(new SupportingFile("Solution.mustache", "", packageName + ".sln"));
        supportingFiles.add(new SupportingFile("gitignore", /*packageFolder,*/ ".gitignore"));
        supportingFiles.add(new SupportingFile("validateModel.mustache", /*packageFolder + File.separator +*/ "Attributes", "ValidateModelStateAttribute.cs"));
        supportingFiles.add(new SupportingFile("git_push.sh.mustache", "", "git-push.sh"));


        supportingFiles.add(new SupportingFile("typeConverter.mustache", /*packageFolder + File.separator +*/ "Converters", "CustomEnumConverter.cs"));


        /*if (aspnetCoreVersion.getOptValue().startsWith("3.") ||
          aspnetCoreVersion.getOptValue().startsWith("5.0") ||
          aspnetCoreVersion.getOptValue().startsWith("6.") ||
          aspnetCoreVersion.getOptValue().startsWith("7.")) {
            supportingFiles.add(new SupportingFile("Extensions" + File.separator + "TypeExtensions.mustache", "Extensions", "TypeExtensions.cs"));
        }*/

        supportingFiles.add(new SupportingFile("Project.csproj.mustache", /*packageFolder,*/ packageName + ".csproj"));
        supportingFiles.add(new SupportingFile("Extensions" + File.separator + "AppExtensions.mustache", /*packageFolder,*/ "Extensions", "AppExtensions.cs"));
        supportingFiles.add(new SupportingFile("Extensions" + File.separator + "ServiceExtensions.mustache", /*packageFolder,*/ "Extensions", "ServiceExtensions.cs"));

        if (!isLibrary) {
            supportingFiles.add(new SupportingFile("Dockerfile.mustache", /*packageFolder,*/ "Dockerfile"));
            supportingFiles.add(new SupportingFile("appsettings.json.mustache", "", "appsettings.json"));
            supportingFiles.add(new SupportingFile("appsettings.Development.json", /*packageFolder,*/ "appsettings.Development.json"));

            // supportingFiles.add(new SupportingFile("Startup.mustache", /*packageFolder,*/ "Startup.cs"));
            supportingFiles.add(new SupportingFile("Program.mustache", /*packageFolder,*/ "Program.cs"));
            supportingFiles.add(
                new SupportingFile("Properties" + File.separator + "launchSettings.mustache", /*packageFolder + File.separator +*/ "Properties",
            "launchSettings.json"));
            // wwwroot files.
            supportingFiles.add(new SupportingFile("wwwroot" + File.separator + "README.md", /*packageFolder + File.separator +*/ "wwwroot", "README.md"));
            supportingFiles.add(new SupportingFile("wwwroot" + File.separator + "index.mustache", /*packageFolder + File.separator +*/ "wwwroot", "index.html"));
            supportingFiles.add(new SupportingFile("wwwroot" + File.separator + "openapi-original.mustache",
                    /*packageFolder + File.separator +*/ "wwwroot", "openapi-original.json"));
        } else {
            supportingFiles.add(new SupportingFile("Project.nuspec.mustache", /*packageFolder,*/ packageName + ".nuspec"));
        }

        if (useSwashbuckle) {
            supportingFiles.add(new SupportingFile("Filters" + File.separator + "BasePathFilter.mustache",
                    /*packageFolder + File.separator +*/ "Filters", "BasePathFilter.cs"));
            supportingFiles.add(new SupportingFile("Filters" + File.separator + "GeneratePathParamsValidationFilter.mustache",
                    /*packageFolder + File.separator +*/ "Filters", "GeneratePathParamsValidationFilter.cs"));
        }

        supportingFiles.add(new SupportingFile("Authentication" + File.separator + "ApiAuthentication.mustache", /*packageFolder + File.separator +*/ "Authentication", "ApiAuthentication.cs"));
        supportingFiles.add(new SupportingFile("Formatters" + File.separator + "InputFormatterStream.mustache", /*packageFolder + File.separator +*/ "Formatters", "InputFormatterStream.cs"));

        modelDocTemplateFiles.put("Documentation/model_doc.mustache", ".md");
        apiDocTemplateFiles.put("Documentation/api_doc.mustache", ".md");
    }

    public void setPackageGuid(String packageGuid) {
        this.packageGuid = packageGuid;
    }

    @Override
    public String apiFileFolder() {
        return outputFolder + File.separator + /*sourceFolder + File.separator + packageName +*/ File.separator + "Controllers" + File.separator + "v1";
    }

    @Override
    public String modelFileFolder() {
        if (!useSeperateModelProject)
        {
            return outputFolder + File.separator /*+ sourceFolder + File.separator + packageName + File.separator*/ + "Contracts";
        } else {
            return outputFolder + File.separator /*+ sourceFolder + File.separator*/ + modelPackage;
        }
    }

    @Override
    public String apiDocFileFolder() {
        return outputFolder + File.separator + "Documentation";
    }

    @Override
    public String modelDocFileFolder() {
        return outputFolder + File.separator + "Documentation";
    }


    @Override
    public Map<String, Object> postProcessSupportingFileData(Map<String, Object> objs) {
        generateJSONSpecFile(objs);
        return super.postProcessSupportingFileData(objs);
    }

    private void addProducesInfo(ApiResponse inputResponse,
      OpenSystemDotnetServerCodegenOperation codegenOperation) {
        ApiResponse response = ModelUtils.getReferencedApiResponse(this.openAPI, inputResponse);
        if (response == null || response.getContent() == null || response.getContent().isEmpty()) {
            return;
        }

        Set<String> produces = response.getContent().keySet();
        if (codegenOperation.produces == null) {
            codegenOperation.produces = new ArrayList<>();
        }

        Set<String> existingMediaTypes = new HashSet<>();
        for (Map<String, String> mediaType : codegenOperation.produces) {
            existingMediaTypes.add(mediaType.get("mediaType"));
        }

        for (String key : produces) {
            // escape quotation to avoid code injection, "*/*" is a special case, do nothing
            String encodedKey = "*/*".equals(key) ? key : escapeQuotationMark(key);
            //Only unique media types should be added to "produces"
            if (!existingMediaTypes.contains(encodedKey)) {
                Map<String, String> mediaType = new HashMap<>();
                mediaType.put("mediaType", encodedKey);
                codegenOperation.produces.add(mediaType);
                codegenOperation.hasProduces = Boolean.TRUE;
            }
        }
    }

    private void addConsumesInfo(Operation operation,
      OpenSystemDotnetServerCodegenOperation codegenOperation) {
        RequestBody requestBody = ModelUtils.getReferencedRequestBody(this.openAPI, operation.getRequestBody());
        if (requestBody == null ||
          requestBody.getContent() == null ||
          requestBody.getContent().isEmpty()) {
            return;
        }

        Set<String> consumes = requestBody.getContent().keySet();
        List<Map<String, String>> mediaTypeList = new ArrayList<>();
        for (String key : consumes) {
            Map<String, String> mediaType = new HashMap<>();
            if ("*/*".equals(key)) {
                // skip as it implies `consumes` in OAS2 is not defined
                continue;
            } else {
                mediaType.put("mediaType", escapeQuotationMark(key));
            }
            mediaTypeList.add(mediaType);
        }

        if (!mediaTypeList.isEmpty()) {
            codegenOperation.consumes = mediaTypeList;
            codegenOperation.hasConsumes = true;
        }
    }

    private CodegenParameter headerToCodegenParameter(Header header,
      String headerName,
      Set<String> imports,
      String mediaTypeSchemaSuffix) {

        if (header == null) {
            return null;
        }
        Parameter headerParam = new Parameter();
        headerParam.setName(headerName);
        headerParam.setIn("header");
        headerParam.setDescription(header.getDescription());
        headerParam.setRequired(header.getRequired());
        headerParam.setDeprecated(header.getDeprecated());
        Header.StyleEnum style = header.getStyle();
        if (style != null) {
            headerParam.setStyle(Parameter.StyleEnum.valueOf(style.name()));
        }
        headerParam.setExplode(header.getExplode());
        headerParam.setSchema(header.getSchema());
        headerParam.setExamples(header.getExamples());
        headerParam.setExample(header.getExample());
        headerParam.setContent(header.getContent());
        headerParam.setExtensions(header.getExtensions());
        CodegenParameter param = fromParameter(headerParam, imports);
        param.setContent(getContent(headerParam.getContent(),
          imports,
          mediaTypeSchemaSuffix));

        return param;
    }

    /**
     * Generate the next name for the given name, i.e. append "2" to the base name if not ending with a number,
     * otherwise increase the number by 1. For example:
     * status    => status2
     * status2   => status3
     * myName100 => myName101
     *
     * @param name The base name
     * @return The next name for the base name
     */
    private static String generateNextName(String name) {
        Pattern pattern = Pattern.compile("\\d+\\z");
        Matcher matcher = pattern.matcher(name);
        if (matcher.find()) {
            String numStr = matcher.group();
            int num = Integer.parseInt(numStr) + 1;
            return name.substring(0, name.length() - numStr.length()) + num;
        } else {
            return name + "2";
        }
    }

    /**
     * Convert OAS Operation object to Codegen Operation object
     *
     * @param httpMethod HTTP method
     * @param operation  OAS operation object
     * @param path       the path of the operation
     * @param servers    list of servers
     * @return Codegen Operation object
     */
    @Override
    public OpenSystemDotnetServerCodegenOperation fromOperation(String path,
      String httpMethod,
      Operation operation,
      List<Server> servers) {
        LOGGER.debug("fromOperation => operation: {}", operation);
        if (operation == null)
            throw new RuntimeException("operation cannot be null in fromOperation");

        Map<String, Schema> schemas = ModelUtils.getSchemas(this.openAPI);
        OpenSystemDotnetServerCodegenOperation op = OpenSystemDotnetServerCodegenModelFactory.newInstance(OpenSystemDotnetServerCodegenModelType.OPERATION);
        Set<String> imports = new HashSet<>();
        if (operation.getExtensions() != null && !operation.getExtensions().isEmpty()) {
            op.vendorExtensions.putAll(operation.getExtensions());

            Object isCallbackRequest = op.vendorExtensions.remove("x-callback-request");
            op.isCallbackRequest = Boolean.TRUE.equals(isCallbackRequest);
        }

        // servers setting
        if (operation.getServers() != null && !operation.getServers().isEmpty()) {
            // use operation-level servers first if defined
            op.servers = fromServers(operation.getServers());
        } else if (servers != null && !servers.isEmpty()) {
            // use path-level servers
            op.servers = fromServers(servers);
        }

        // store the original operationId for plug-in
        op.operationIdOriginal = operation.getOperationId();

        String operationId = getOrGenerateOperationId(operation, path, httpMethod);
        // remove prefix in operationId
        if (removeOperationIdPrefix) {
            // The prefix is everything before the removeOperationIdPrefixCount occurrence of removeOperationIdPrefixDelimiter
            String[] components = operationId.split("[" + removeOperationIdPrefixDelimiter + "]");
            if (components.length > 1) {
                // If removeOperationIdPrefixCount is -1 or bigger that the number of occurrences, uses the last one
                int component_number = removeOperationIdPrefixCount == -1 ? components.length - 1 : removeOperationIdPrefixCount;
                component_number = Math.min(component_number, components.length - 1);
                // Reconstruct the operationId from its split elements and the delimiter
                operationId = String.join(removeOperationIdPrefixDelimiter, Arrays.copyOfRange(components, component_number, components.length));
            }
        }
        operationId = removeNonNameElementToCamelCase(operationId);

        if (isStrictSpecBehavior() && !path.startsWith("/")) {
            // modifies an operation.path to strictly conform to OpenAPI Spec
            op.path = "/" + path;
        } else {
            op.path = path;
        }

        op.operationId = toOperationId(operationId);
        op.summary = escapeText(operation.getSummary());
        op.unescapedNotes = operation.getDescription();
        op.notes = escapeText(operation.getDescription());
        op.hasConsumes = false;
        op.hasProduces = false;
        if (operation.getDeprecated() != null) {
            op.isDeprecated = operation.getDeprecated();
        }

        addConsumesInfo(operation, op);

        if (operation.getResponses() != null && !operation.getResponses().isEmpty()) {
            ApiResponse methodResponse = findMethodResponse(operation.getResponses());
            for (Map.Entry<String, ApiResponse> operationGetResponsesEntry : operation.getResponses().entrySet()) {
                String key = operationGetResponsesEntry.getKey();
                ApiResponse response = operationGetResponsesEntry.getValue();
                addProducesInfo(response, op);
                CodegenResponse r = fromResponse(key, response);
                Map<String, Header> headers = response.getHeaders();
                if (headers != null) {
                    List<CodegenParameter> responseHeaders = new ArrayList<>();
                    for (Entry<String, Header> entry : headers.entrySet()) {
                        String headerName = entry.getKey();
                        Header header = ModelUtils.getReferencedHeader(this.openAPI, entry.getValue());
                        CodegenParameter responseHeader = headerToCodegenParameter(header, headerName, imports, String.format(Locale.ROOT, "%sResponseParameter", r.code));
                        responseHeaders.add(responseHeader);
                    }
                    r.setResponseHeaders(responseHeaders);
                }
                String mediaTypeSchemaSuffix = String.format(Locale.ROOT, "%sResponseBody", r.code);
                r.setContent(getContent(response.getContent(), imports, mediaTypeSchemaSuffix));

                if (!addSchemaImportsFromV3SpecLocations) {
                    if (r.baseType != null &&
                            !defaultIncludes.contains(r.baseType) &&
                            !languageSpecificPrimitives.contains(r.baseType)) {
                        imports.add(r.baseType);
                    }
                    if ("set".equals(r.containerType) && typeMapping.containsKey(r.containerType)) {
                        op.uniqueItems = true;
                        imports.add(typeMapping.get(r.containerType));
                    }
                }

                op.responses.add(r);
                if (Boolean.TRUE.equals(r.isBinary) && Boolean.TRUE.equals(r.is2xx) && Boolean.FALSE.equals(op.isResponseBinary)) {
                    op.isResponseBinary = Boolean.TRUE;
                }
                if (Boolean.TRUE.equals(r.isFile) && Boolean.TRUE.equals(r.is2xx) && Boolean.FALSE.equals(op.isResponseFile)) {
                    op.isResponseFile = Boolean.TRUE;
                }
                if (Boolean.TRUE.equals(r.isDefault)) {
                    op.defaultReturnType = Boolean.TRUE;
                }

                // check if any 4xx or 5xx response has an error response object defined
                if ((Boolean.TRUE.equals(r.is4xx) || Boolean.TRUE.equals(r.is5xx)) &&
                        Boolean.FALSE.equals(r.primitiveType) && Boolean.FALSE.equals(r.simpleType)) {
                    op.hasErrorResponseObject = Boolean.TRUE;
                }
            }

            // check if the operation can both return a 2xx response with a body and without
            if (op.responses.stream().anyMatch(response -> response.is2xx && response.dataType != null) &&
                    op.responses.stream().anyMatch(response -> response.is2xx && response.dataType == null)) {
                op.isResponseOptional = Boolean.TRUE;
            }

            op.responses.sort((a, b) -> {
                int aScore = a.isWildcard() ? 2 : a.isRange() ? 1 : 0;
                int bScore = b.isWildcard() ? 2 : b.isRange() ? 1 : 0;
                return Integer.compare(aScore, bScore);
            });

            if (methodResponse != null) {
                handleMethodResponse(operation, schemas, op, methodResponse, importMapping);
            }
        }

        if (operation.getCallbacks() != null && !operation.getCallbacks().isEmpty()) {
            operation.getCallbacks().forEach((name, callback) -> {
                CodegenCallback c = fromCallback(name, callback, servers);
                op.callbacks.add(c);
            });
        }

        List<Parameter> parameters = operation.getParameters();
        List<CodegenParameter> allParams = new ArrayList<>();
        List<CodegenParameter> bodyParams = new ArrayList<>();
        List<CodegenParameter> pathParams = new ArrayList<>();
        List<CodegenParameter> queryParams = new ArrayList<>();
        List<CodegenParameter> headerParams = new ArrayList<>();
        List<CodegenParameter> cookieParams = new ArrayList<>();
        List<CodegenParameter> formParams = new ArrayList<>();
        List<CodegenParameter> requiredParams = new ArrayList<>();
        List<CodegenParameter> optionalParams = new ArrayList<>();
        List<CodegenParameter> requiredAndNotNullableParams = new ArrayList<>();

        CodegenParameter bodyParam = null;
        RequestBody requestBody = operation.getRequestBody();
        if (requestBody != null) {
            String contentType = getContentType(requestBody);
            if (contentType != null) {
                contentType = contentType.toLowerCase(Locale.ROOT);
            }
            if (contentType != null &&
                    (contentType.startsWith("application/x-www-form-urlencoded") ||
                            contentType.startsWith("multipart"))) {
                // process form parameters
                formParams = fromRequestBodyToFormParameters(requestBody, imports);
                op.isMultipart = contentType.startsWith("multipart");
                for (CodegenParameter cp : formParams) {
                    setParameterEncodingValues(cp, requestBody.getContent().get(contentType));
                    postProcessParameter(cp);
                }
                // add form parameters to the beginning of all parameter list
                if (prependFormOrBodyParameters) {
                    for (CodegenParameter cp : formParams) {
                        allParams.add(cp.copy());
                    }
                }
            } else {
                // process body parameter
                requestBody = ModelUtils.getReferencedRequestBody(this.openAPI,
                  requestBody);

                String bodyParameterName = "";
                if (op.vendorExtensions != null && op.vendorExtensions.containsKey("x-codegen-request-body-name")) {
                    bodyParameterName = (String) op.vendorExtensions.get("x-codegen-request-body-name");
                }
                bodyParam = fromRequestBody(requestBody, imports, bodyParameterName);
                bodyParam.description = escapeText(requestBody.getDescription());
                postProcessParameter(bodyParam);

                bodyParams.add(bodyParam);

                if (prependFormOrBodyParameters) {
                    allParams.add(bodyParam);
                }

                // add example
                if (schemas != null && !isSkipOperationExample()) {
                    op.requestBodyExamples = new ExampleGenerator(schemas,
                      this.openAPI).generate(null,
                        new ArrayList<>(getConsumesInfo(this.openAPI,
                          operation)),
                        bodyParam.baseType);
                }
            }
        }

        if (parameters != null) {
            for (Parameter param : parameters) {
                param = ModelUtils.getReferencedParameter(this.openAPI, param);

                CodegenParameter p = fromParameter(param, imports);
                p.setContent(getContent(param.getContent(), imports, "RequestParameter" + toModelName(param.getName())));

                // ensure unique params
                if (ensureUniqueParams) {
                    while (!isParameterNameUnique(p, allParams)) {
                        p.paramName = generateNextName(p.paramName);
                    }
                }

                allParams.add(p);

                if (param instanceof QueryParameter || "query".equalsIgnoreCase(param.getIn())) {
                    queryParams.add(p.copy());
                } else if (param instanceof PathParameter || "path".equalsIgnoreCase(param.getIn())) {
                    pathParams.add(p.copy());
                } else if (param instanceof HeaderParameter || "header".equalsIgnoreCase(param.getIn())) {
                    headerParams.add(p.copy());
                } else if (param instanceof CookieParameter || "cookie".equalsIgnoreCase(param.getIn())) {
                    cookieParams.add(p.copy());
                } else {
                    LOGGER.warn("Unknown parameter type {} for {}", p.baseType, p.baseName);
                }

            }
        }

        // add form/body parameter (if any) to the end of all parameter list
        if (!prependFormOrBodyParameters) {
            for (CodegenParameter cp : formParams) {
                if (ensureUniqueParams) {
                    while (!isParameterNameUnique(cp, allParams)) {
                        cp.paramName = generateNextName(cp.paramName);
                    }
                }
                allParams.add(cp.copy());
            }

            for (CodegenParameter cp : bodyParams) {
                if (ensureUniqueParams) {
                    while (!isParameterNameUnique(cp, allParams)) {
                        cp.paramName = generateNextName(cp.paramName);
                    }
                }
                allParams.add(cp.copy());
            }
        }

        // create optional, required parameters
        for (CodegenParameter cp : allParams) {
            if (cp.required) { //required parameters
                requiredParams.add(cp.copy());
            } else { // optional parameters
                optionalParams.add(cp.copy());
                op.hasOptionalParams = true;
            }

            if (cp.required && !cp.isNullable) {
                requiredAndNotNullableParams.add(cp.copy());
            }
        }

        // add imports to operation import tag
        for (String i : imports) {
            if (needToImport(i)) {
                op.imports.add(i);
            }
        }

        op.bodyParam = bodyParam;
        op.httpMethod = httpMethod.toUpperCase(Locale.ROOT);

        // move "required" parameters in front of "optional" parameters
        if (sortParamsByRequiredFlag) {
            Collections.sort(allParams, new Comparator<CodegenParameter>() {
                @Override
                public int compare(CodegenParameter one, CodegenParameter another) {
                    if (one.required == another.required)
                        return 0;
                    else if (one.required)
                        return -1;
                    else
                        return 1;
                }
            });
        }

        op.allParams = allParams;
        op.bodyParams = bodyParams;
        op.pathParams = pathParams;
        op.queryParams = queryParams;
        op.headerParams = headerParams;
        op.cookieParams = cookieParams;
        op.formParams = formParams;
        op.requiredParams = requiredParams;
        op.optionalParams = optionalParams;
        op.requiredAndNotNullableParams = requiredAndNotNullableParams;
        op.externalDocs = operation.getExternalDocs();
        // legacy support
        op.nickname = op.operationId;

        if (op.allParams.size() > 0) {
            op.hasParams = true;
        }
        op.hasRequiredParams = op.requiredParams.size() > 0;

        // set Restful Flag
        op.isRestfulShow = op.isRestfulShow();
        op.isRestfulIndex = op.isRestfulIndex();
        op.isRestfulCreate = op.isRestfulCreate();
        op.isRestfulUpdate = op.isRestfulUpdate();
        op.isRestfulDestroy = op.isRestfulDestroy();
        op.isRestful = op.isRestful();

        op.requestName = op.requestName();

        return op;
    }


    @Override
    protected void processOperation(CodegenOperation operation) {
        super.processOperation(operation);

        // HACK: Unlikely in the wild, but we need to clean operation paths for MVC Routing
        if (operation.path != null) {
            String original = operation.path;
            operation.path = operation.path.replace("?", "/");
            if (!original.equals(operation.path)) {
                LOGGER.warn("Normalized {} to {}. Please verify generated source.", original, operation.path);
            }
        }

        // Converts, for example, PUT to HttpPut for controller attributes
        operation.httpMethod = "Http" + operation.httpMethod.charAt(0) + operation.httpMethod.substring(1).toLowerCase(Locale.ROOT);
    }

    @Override
    public OperationsMap postProcessOperationsWithModels(OperationsMap objs,
      List<ModelMap> allModels) {
        super.postProcessOperationsWithModels(objs,
          allModels);
        // We need to postprocess the operations to add proper consumes tags and fix form file handling
        if (objs != null) {
            OperationMap operations = objs.getOperations();
            if (operations != null) {
                List<CodegenOperation> ops = operations.getOperation();
                for (CodegenOperation operation : ops) {
                    // OpenSystemDotnetServerCodegenOperation operation = (OpenSystemDotnetServerCodegenOperation) op;
                    if (operation.consumes == null) {
                        continue;
                    }
                    if (operation.consumes.size() == 0) {
                        continue;
                    }

                    // Build a consumes string for the operation we cannot iterate in the template as we need a ','
                    // after each entry but the last

                    StringBuilder consumesString = new StringBuilder();
                    for (Map<String, String> consume : operation.consumes) {
                        if (!consume.containsKey("mediaType")) {
                            continue;
                        }

                        if (consumesString.toString().isEmpty()) {
                            consumesString = new StringBuilder("\"" + consume.get("mediaType") + "\"");
                        } else {
                            consumesString.append(", \"").append(consume.get("mediaType")).append("\"");
                        }

                        // In a multipart/form-data consuming context binary data is best handled by an IFormFile
                        if (!consume.get("mediaType").equals("multipart/form-data")) {
                            continue;
                        }

                        // Change dataType of binary parameters to IFormFile for formParams in multipart/form-data
                        for (CodegenParameter param : operation.formParams) {
                            if (param.isBinary) {
                                param.dataType = "IFormFile";
                                param.baseType = "IFormFile";
                            }
                        }

                        for (CodegenParameter param : operation.allParams) {
                            if (param.isBinary && param.isFormParam) {
                                param.dataType = "IFormFile";
                                param.baseType = "IFormFile";
                            }
                        }
                    }

                    if (!consumesString.toString().isEmpty()) {
                        operation.vendorExtensions.put("x-aspnetcore-consumes",
                          consumesString.toString());
                    }
                }
            }
        }
        return objs;
    }

    @Override
    public Mustache.Compiler processCompiler(Mustache.Compiler compiler) {
        // To avoid unexpected behaviors when options are passed programmatically such as { "useCollection": "" }
        return super.processCompiler(compiler).emptyStringIsFalse(true);
    }

    @Override
    public String toRegularExpression(String pattern) {
        return escapeText(pattern);
    }

    @SuppressWarnings("rawtypes")
    @Override
    public String getNullableType(Schema p, String type) {
      if (languageSpecificPrimitives.contains(type)) {
          if (isSupportNullable() && ModelUtils.isNullable(p) && (nullableType.contains(type) || nullReferenceTypesFlag)) {
              return type + "?";
          } else {
              return type;
          }
      } else {
          return null;
      }
    }

    private void setCliOption(CliOption cliOption) throws IllegalArgumentException {
      if (additionalProperties.containsKey(cliOption.getOpt())) {
          // TODO Hack - not sure why the empty strings become boolean.
          Object obj = additionalProperties.get(cliOption.getOpt());
          if (!SchemaTypeUtil.BOOLEAN_TYPE.equals(cliOption.getType())) {
              if (obj instanceof Boolean) {
                  obj = "";
                  additionalProperties.put(cliOption.getOpt(), obj);
              }
          }
          cliOption.setOptValue(obj.toString());
      } else {
          additionalProperties.put(cliOption.getOpt(), cliOption.getOptValue());
      }
      if (cliOption.getOptValue() == null) {
          cliOption.setOptValue(cliOption.getDefault());
          throw new IllegalArgumentException(cliOption.getOpt() + ": Invalid value '" + additionalProperties.get(cliOption.getOpt()).toString() + "'" +
                  ". " + cliOption.getDescription());
      }
    }

    private void setDomainName() {
      if (additionalProperties.containsKey(DOMAIN_NAME)) {
          domainName = (String) additionalProperties.get(DOMAIN_NAME);
      } else if (domainName != null) {
          additionalProperties.put(DOMAIN_NAME,
              domainName);
      }

      if (domainName != null) {
        capitalDomainName = domainName.substring(0,
          1).toUpperCase()
          + domainName.substring(1);
        lowerDomainName = domainName.substring(0,
          1).toLowerCase()
          + domainName.substring(1);

        int index = capitalDomainName.indexOf("-");
        while (index >= 0) {
            if (index < capitalDomainName.length() - 3) {
              capitalDomainName = capitalDomainName.substring(index + 1,
                index + 2).toUpperCase()
                + capitalDomainName.substring(index + 2);
              lowerDomainName = lowerDomainName.substring(index + 1,
                index + 2).toUpperCase()
                + lowerDomainName.substring(index + 2);
            }

            index = capitalDomainName.indexOf("-",
              index + 1);
        }

        capitalDomainName = capitalDomainName.replace("-",
          "");
        additionalProperties.put(CAPITAL_DOMAIN_NAME,
              capitalDomainName);

        lowerDomainName = lowerDomainName.replace("-",
          "");
        additionalProperties.put(LOWER_DOMAIN_NAME,
          lowerDomainName);
      }
    }

    private void setProjectName() {
      if (additionalProperties.containsKey(PROJECT_NAME)) {
          projectName = (String) additionalProperties.get(PROJECT_NAME);
      } else if (projectName != null) {
          additionalProperties.put(PROJECT_NAME,
              projectName);
      }
    }


    private void setUrlRoot() {
        if (additionalProperties.containsKey(URL_ROOT)) {
          urlRoot = (String) additionalProperties.get(URL_ROOT);
      } else if (urlRoot != null) {
          additionalProperties.put(URL_ROOT,
              urlRoot);
      }
    }

    private void setServiceName() {
      if (additionalProperties.containsKey(SERVICE_NAME)) {
          serviceName = (String) additionalProperties.get(SERVICE_NAME);
      } else if (serviceName != null) {
          additionalProperties.put(SERVICE_NAME,
              serviceName);
      }
    }

    private void setFullServiceName() {
      if (additionalProperties.containsKey(FULL_SERVICE_NAME)) {
          fullServiceName = (String) additionalProperties.get(FULL_SERVICE_NAME);
      } else if (fullServiceName != null) {
          additionalProperties.put(SERVICE_NAME,
              fullServiceName);
      }
    }

    private void setSpecJsonFile() {
      if (additionalProperties.containsKey(SPEC_JSON_FILE)) {
          specJsonFile = (String) additionalProperties.get(SPEC_JSON_FILE);
      } else if (specJsonFile != null) {
          additionalProperties.put(SPEC_JSON_FILE,
              specJsonFile);
      }
    }

   private void setSourceRoot() {
      if (additionalProperties.containsKey(SOURCE_ROOT)) {
          sourceRoot = (String) additionalProperties.get(SOURCE_ROOT);
      } else if (sourceRoot != null) {
          additionalProperties.put(SOURCE_ROOT,
              sourceRoot);
      }
    }

    private void setDockerTag() {
      if (additionalProperties.containsKey(DOCKER_TAG)) {
          dockerTag = (String) additionalProperties.get(DOCKER_TAG);
      } else if (dockerTag != null) {
          additionalProperties.put(DOCKER_TAG,
              dockerTag);
      } else if (serviceName != null) {
          additionalProperties.put(DOCKER_TAG,
              serviceName.toLowerCase() + ":latest");
      } else {
          additionalProperties.put("dockerTag",
              packageName.toLowerCase(Locale.ROOT));
      }
    }

    private void setClassModifier() {
      // CHeck for class modifier if not present set the default value.
      setCliOption(classModifier);

      // If class modifier is abstract then the methods need to be abstract too.
      if ("abstract".equals(classModifier.getOptValue())) {
          operationModifier.setOptValue(classModifier.getOptValue());
          additionalProperties.put(OPERATION_MODIFIER, operationModifier.getOptValue());
          LOGGER.warn("classModifier is {} so forcing operationModifier to {}", classModifier.getOptValue(), operationModifier.getOptValue());
      }
    }

    private void setOperationModifier() {
      setCliOption(operationModifier);

      // If operation modifier is abstract then dont generate any body
      if ("abstract".equals(operationModifier.getOptValue())) {
          generateBody = false;
          additionalProperties.put(GENERATE_BODY, generateBody);
          LOGGER.warn("operationModifier is {} so forcing generateBody to {}", operationModifier.getOptValue(), generateBody);
      } else if (additionalProperties.containsKey(GENERATE_BODY)) {
          generateBody = convertPropertyToBooleanAndWriteBack(GENERATE_BODY);
      } else {
          additionalProperties.put(GENERATE_BODY, generateBody);
      }
    }

    private void setModelClassModifier() {
      setCliOption(modelClassModifier);

      // If operation modifier is abstract then dont generate any body
      if (isLibrary) {
          modelClassModifier.setOptValue("");
          additionalProperties.put(MODEL_CLASS_MODIFIER, modelClassModifier.getOptValue());
          LOGGER.warn("buildTarget is {} so removing any modelClassModifier ", buildTarget.getOptValue());
      }
    }

    private void setBuildTarget() {
      setCliOption(buildTarget);
      if ("library".equals(buildTarget.getOptValue())) {
          LOGGER.warn("buildTarget is {} so changing default isLibrary to true", buildTarget.getOptValue());
          isLibrary = true;
          projectSdk = SDK_LIB;
          additionalProperties.put(CLASS_MODIFIER, "abstract");
      } else {
          isLibrary = false;
          projectSdk = SDK_WEB;
      }
      additionalProperties.put(IS_LIBRARY, isLibrary);
    }

    private void setAspNetCoreVersion(String packageFolder) {
      setCliOption(aspnetCoreVersion);

      if (aspnetCoreVersion.getOptValue().startsWith("3.") || aspnetCoreVersion.getOptValue().startsWith("5.0") || aspnetCoreVersion.getOptValue().startsWith("6.") || aspnetCoreVersion.getOptValue().startsWith("7.")) {
          compatibilityVersion = null;
      } else if ("2.0".equals(aspnetCoreVersion.getOptValue())) {
          compatibilityVersion = null;
      } else {
          // default, do nothing
          compatibilityVersion = "Version_" + aspnetCoreVersion.getOptValue().replace(".", "_");
      }
      LOGGER.info("ASP.NET core version: {}", aspnetCoreVersion.getOptValue());
      if (!additionalProperties.containsKey(CodegenConstants.TEMPLATE_DIR)) {
            // embeddedTemplateDir = templateDir = "src" + File.separator + "main" + File.separator + "resources" + File.separator + "broadridge-fxl-cs-server";
      }
      additionalProperties.put(COMPATIBILITY_VERSION, compatibilityVersion);
    }

    private String determineTemplateVersion(String frameworkVersion) {
        switch (frameworkVersion) {
            case "6.0":
            case "5.0":
            case "3.1":
                return "3.0";

            case "2.2":
                return "2.1";

            default:
                return frameworkVersion;
        }
    }

    private void setPocoModels() {
        if (additionalProperties.containsKey(MODEL_POCOMODE)) {
            pocoModels = convertPropertyToBooleanAndWriteBack(MODEL_POCOMODE);
        } else {
            additionalProperties.put(MODEL_POCOMODE, pocoModels);
        }
    }

    private void setUseSeperateModelProject() {
        if (additionalProperties.containsKey(USE_MODEL_SEPERATEPROJECT)) {
            useSeperateModelProject = convertPropertyToBooleanAndWriteBack(USE_MODEL_SEPERATEPROJECT);
            if (useSeperateModelProject)
            {
                LOGGER.info("Using seperate model project");
            }
        } else {
            additionalProperties.put(USE_MODEL_SEPERATEPROJECT, useSeperateModelProject);
        }
    }

    private void setUseSwashbuckle() {
        if (isLibrary) {
            LOGGER.warn("isLibrary is true so changing default useSwashbuckle to false");
            useSwashbuckle = false;
        } else {
            useSwashbuckle = true;
        }
        if (additionalProperties.containsKey(USE_SWASHBUCKLE)) {
            useSwashbuckle = convertPropertyToBooleanAndWriteBack(USE_SWASHBUCKLE);
        } else {
            additionalProperties.put(USE_SWASHBUCKLE, useSwashbuckle);
        }
    }

    private void setOperationIsAsync() {
        if (isLibrary) {
            operationIsAsync = false;
            additionalProperties.put(OPERATION_IS_ASYNC, operationIsAsync);
        } else if (additionalProperties.containsKey(OPERATION_IS_ASYNC)) {
            operationIsAsync = convertPropertyToBooleanAndWriteBack(OPERATION_IS_ASYNC);
        } else {
            additionalProperties.put(OPERATION_IS_ASYNC, operationIsAsync);
        }
    }

    private void setIsFramework() {
        if (aspnetCoreVersion.getOptValue().startsWith("3.")) {// default, do nothing
            LOGGER.warn(
                    "ASP.NET core version is {} so changing to use frameworkReference instead of packageReference ",
                    aspnetCoreVersion.getOptValue());
            useFrameworkReference = true;
            additionalProperties.put(USE_FRAMEWORK_REFERENCE, useFrameworkReference);
            additionalProperties.put(TARGET_FRAMEWORK, "netcoreapp" + aspnetCoreVersion.getOptValue());
        } else if (aspnetCoreVersion.getOptValue().startsWith("5.")) {// default, do nothing
            LOGGER.warn(
                    "ASP.NET core version is {} so changing to use frameworkReference instead of packageReference ",
                    aspnetCoreVersion.getOptValue());
            useFrameworkReference = true;
            additionalProperties.put(USE_FRAMEWORK_REFERENCE, useFrameworkReference);
            additionalProperties.put(TARGET_FRAMEWORK, "net5.0");
        } else if (aspnetCoreVersion.getOptValue().startsWith("6.")) {
            LOGGER.warn(
                    "ASP.NET core version is {} so changing to use frameworkReference instead of packageReference ",
                    aspnetCoreVersion.getOptValue());
            useFrameworkReference = true;
            additionalProperties.put(USE_FRAMEWORK_REFERENCE, useFrameworkReference);
            additionalProperties.put(TARGET_FRAMEWORK, "net6.0");
        } else if (aspnetCoreVersion.getOptValue().startsWith("7.")) {
            LOGGER.warn(
                    "ASP.NET core version is {} so changing to use frameworkReference instead of packageReference ",
                    aspnetCoreVersion.getOptValue());
            useFrameworkReference = true;
            additionalProperties.put(USE_FRAMEWORK_REFERENCE, useFrameworkReference);
            additionalProperties.put(TARGET_FRAMEWORK, "net7.0");
        } else {
            if (additionalProperties.containsKey(USE_FRAMEWORK_REFERENCE)) {
                useFrameworkReference = convertPropertyToBooleanAndWriteBack(USE_FRAMEWORK_REFERENCE);
            } else {
                additionalProperties.put(USE_FRAMEWORK_REFERENCE, useFrameworkReference);
            }
            additionalProperties.put(TARGET_FRAMEWORK, "netcoreapp" + aspnetCoreVersion);
        }
    }

    private void setUseNewtonsoft() {
        useNewtonsoft = false;
        additionalProperties.put(USE_NEWTONSOFT, false);
    }

    private void setUseEndpointRouting() {
        if (aspnetCoreVersion.getOptValue().startsWith("3.") || aspnetCoreVersion.getOptValue().startsWith("5.")) {
            LOGGER.warn("ASP.NET core version is {} so switching to old style endpoint routing.", aspnetCoreVersion.getOptValue());
            useDefaultRouting = false;
            additionalProperties.put(USE_DEFAULT_ROUTING, useDefaultRouting);
        } else {
            if (additionalProperties.containsKey(USE_DEFAULT_ROUTING)) {
                useDefaultRouting = convertPropertyToBooleanAndWriteBack(USE_DEFAULT_ROUTING);
            } else {
                additionalProperties.put(USE_DEFAULT_ROUTING, useDefaultRouting);
            }
        }
    }

    private void setSwashbuckleVersion() {
      setCliOption(swashbuckleVersion);

      if (aspnetCoreVersion.getOptValue().startsWith("3.")) {
          LOGGER.warn("ASP.NET core version is {} so changing default Swashbuckle version to 6.4.0.", aspnetCoreVersion.getOptValue());
          swashbuckleVersion.setOptValue("6.4.0");
          additionalProperties.put(SWASHBUCKLE_VERSION, swashbuckleVersion.getOptValue());
      } else if (aspnetCoreVersion.getOptValue().startsWith("5.")) {
          // for aspnet core 5.x, use Swashbuckle 6.4 instead
          LOGGER.warn("ASP.NET core version is {} so changing default Swashbuckle version to 6.4.0.", aspnetCoreVersion.getOptValue());
          swashbuckleVersion.setOptValue("6.4.0");
          additionalProperties.put(SWASHBUCKLE_VERSION, swashbuckleVersion.getOptValue());
      } else if (aspnetCoreVersion.getOptValue().startsWith("6.")) {
          LOGGER.warn("ASP.NET core version is {} so changing default Swashbuckle version to 6.4.0.", aspnetCoreVersion.getOptValue());
          swashbuckleVersion.setOptValue("6.4.0");
          additionalProperties.put(SWASHBUCKLE_VERSION, swashbuckleVersion.getOptValue());
      } else if (aspnetCoreVersion.getOptValue().startsWith("7.")) {
          LOGGER.warn("ASP.NET core version is {} so changing default Swashbuckle version to 6.4.0.", aspnetCoreVersion.getOptValue());
          swashbuckleVersion.setOptValue("6.4.0");
          additionalProperties.put(SWASHBUCKLE_VERSION, swashbuckleVersion.getOptValue());
      } else {
          // default, do nothing
          LOGGER.info("Swashbuckle version: {}", swashbuckleVersion.getOptValue());
      }
    }
}
