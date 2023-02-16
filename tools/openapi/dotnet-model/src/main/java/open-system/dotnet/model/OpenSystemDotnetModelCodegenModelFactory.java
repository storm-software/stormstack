package opensystem.dotnet.model;

import org.openapitools.codegen.*;
import java.lang.reflect.InvocationTargetException;

public class OpenSystemDotnetModelCodegenModelFactory {
    @SuppressWarnings("unchecked")
    public static <T> T newInstance(OpenSystemDotnetModelCodegenModelType type) {
        try {
            return (T) type.getDefaultImplementation().getDeclaredConstructor().newInstance();
        } catch (IllegalAccessException |
          InstantiationException |
          NoSuchMethodException |
          InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
