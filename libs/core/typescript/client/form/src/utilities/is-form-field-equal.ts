export const isFormFieldEqual = (
  field1: { field: string; formId: string },
  field2: { field: string; formId: string }
) => field1.field === field2.field && field1.formId === field2.formId;
