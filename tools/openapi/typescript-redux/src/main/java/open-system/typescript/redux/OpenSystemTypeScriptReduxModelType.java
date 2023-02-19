package opensystem.typescript.redux;

import org.openapitools.codegen.*;

public enum OpenSystemTypeScriptReduxModelType {

    MODEL(CodegenModel.class),
    OPERATION(OpenSystemTypeScriptReduxOperation.class),
    PARAMETER(CodegenParameter.class),
    PROPERTY(CodegenProperty.class),
    RESPONSE(CodegenResponse.class),
    SECURITY(CodegenSecurity.class);

    private final Class<?> defaultImplementation;

    private OpenSystemTypeScriptReduxModelType(Class<?> defaultImplementation) {
        this.defaultImplementation = defaultImplementation;
    }

    public Class<?> getDefaultImplementation() {
        return defaultImplementation;
    }
}
