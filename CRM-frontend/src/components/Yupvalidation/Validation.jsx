
import * as Yup from 'yup'

export const ValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required")
    .email("Invaild email format"),
  password: Yup.string().required("Password is required")
    .min(8, "password must be at least 8 characters")
})

