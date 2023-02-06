import { get, isEmptyObject } from "@open-system/core-typescript-utilities";
import { useFormContext } from "react-hook-form";

export function useFieldErrors(name?: string, excludeRequired = true) {
  const {
    getFieldState,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext();

  let errorList: Record<string, string> = (get(errors, name) as any)?.types;
  if (
    excludeRequired &&
    !isEmptyObject(errorList) &&
    ((name && getFieldState(name)?.isTouched) ||
      isSubmitted ||
      isEmptyObject(get(touchedFields, name)))
  ) {
    errorList = Object.entries(errorList).reduce(
      (ret: Record<string, string>, [type, message]) => {
        if (type !== "required") {
          ret[type] = message;
        }

        return ret;
      },
      {}
    );
  }

  return errorList;
}
