package opensystem.dotnet.server;

import org.openapitools.codegen.*;

public enum OpenSystemDotnetServerCodegenModelType {

    MODEL(CodegenModel.class),
    OPERATION(OpenSystemDotnetServerCodegenOperation.class),
    PARAMETER(CodegenParameter.class),
    PROPERTY(CodegenProperty.class),
    RESPONSE(CodegenResponse.class),
    SECURITY(CodegenSecurity.class);

    private final Class<?> defaultImplementation;

    private OpenSystemDotnetServerCodegenModelType(Class<?> defaultImplementation) {
        this.defaultImplementation = defaultImplementation;
    }

    public Class<?> getDefaultImplementation() {
        return defaultImplementation;
    }
}
