package opensystem.typescript.redux;

import org.openapitools.codegen.*;
import java.lang.reflect.InvocationTargetException;

public class OpenSystemTypeScriptReduxModelFactory {
    @SuppressWarnings("unchecked")
    public static <T> T newInstance(OpenSystemTypeScriptReduxModelType type) {
        try {
            return (T) type.getDefaultImplementation().getDeclaredConstructor().newInstance();
        } catch (IllegalAccessException | InstantiationException | NoSuchMethodException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
