package opensystem.dotnet.model;

import org.openapitools.codegen.*;

public enum OpenSystemDotnetModelCodegenModelType {

    MODEL(CodegenModel.class),
    OPERATION(OpenSystemDotnetModelCodegenOperation.class),
    PARAMETER(CodegenParameter.class),
    PROPERTY(CodegenProperty.class),
    RESPONSE(CodegenResponse.class),
    SECURITY(CodegenSecurity.class);

    private final Class<?> defaultImplementation;

    private OpenSystemDotnetModelCodegenModelType(Class<?> defaultImplementation) {
        this.defaultImplementation = defaultImplementation;
    }

    public Class<?> getDefaultImplementation() {
        return defaultImplementation;
    }
}
