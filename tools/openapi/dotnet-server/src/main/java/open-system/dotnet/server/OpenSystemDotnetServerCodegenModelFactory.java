package opensystem.dotnet.server;

import org.openapitools.codegen.*;
import java.lang.reflect.InvocationTargetException;

public class OpenSystemDotnetServerCodegenModelFactory {
    @SuppressWarnings("unchecked")
    public static <T> T newInstance(OpenSystemDotnetServerCodegenModelType type) {
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
