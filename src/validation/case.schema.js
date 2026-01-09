import * as yup from "yup";

export const createCaseSchema = yup.object({
  case_name: yup
    .string()
    .required("Case name is required")
    .max(50, "Case name cannot exceed 50 characters")
    .test(
      "no-leading-space",
      "Case name cannot start with whitespace",
      (value) => !value || !/^\s/.test(value)
    ),

  description: yup
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .nullable(),
});
