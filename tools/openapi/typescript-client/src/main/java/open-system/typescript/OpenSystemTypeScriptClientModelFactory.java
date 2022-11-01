package opensystem.typescript.client;

import org.openapitools.codegen.*;
import java.lang.reflect.InvocationTargetException;

public class OpenSystemTypeScriptClientModelFactory {
    @SuppressWarnings("unchecked")
    public static <T> T newInstance(OpenSystemTypeScriptClientModelType type) {
        try {
            return (T) type.getDefaultImplementation().getDeclaredConstructor().newInstance();
        } catch (IllegalAccessException | InstantiationException | NoSuchMethodException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
