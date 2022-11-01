package opensystem.typescript.client;

import org.openapitools.codegen.*;

public enum OpenSystemTypeScriptClientModelType {

    MODEL(CodegenModel.class),
    OPERATION(OpenSystemTypeScriptClientOperation.class),
    PARAMETER(CodegenParameter.class),
    PROPERTY(CodegenProperty.class),
    RESPONSE(CodegenResponse.class),
    SECURITY(CodegenSecurity.class);

    private final Class<?> defaultImplementation;

    private OpenSystemTypeScriptClientModelType(Class<?> defaultImplementation) {
        this.defaultImplementation = defaultImplementation;
    }

    public Class<?> getDefaultImplementation() {
        return defaultImplementation;
    }
}
