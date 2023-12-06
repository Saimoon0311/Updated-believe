import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const emailRegex = '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/';

/* The `passwordSchema` object defines the validation rules for the password field and the
confirm_password field. */
const passwordSchema = {
  password: yup
    .string()
    .default('I53rdgen@')
    .required('Please Enter your password')
    .max(25, 'Password must be less than 25 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&_]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
  confirm_password: yup
    .string()
    .default('I53rdgen@')
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
};

/* The `signUpschema` object is defining the validation rules for the fields in a sign-up form. It is
using the `yup` library to create a schema object with specific validation rules for each field. */
const signUpschema = yup.object().shape({
  email: yup
    .string()
    // .email('Email must be valid')
    .required('Please Enter your email')
    .min(3, 'Email must be valid')
    .max(50, 'Email must be valid')
    .email('email is not Valid'),
  name: yup
    .string()
    .required('Please Enter your fullname')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[A-Za-z .]*$/, 'Please Enter valid name')
    .min(2, 'Name must be atleast 2 characters')
    .max(50, 'Name must be of 50 characters'),
  // .matches(/^[A-Za-z ]*$/, 'Please enter valid name')
  // phone: yup
  //   .number()
  //   .required('Please Enter your number')
  //   .typeError('Please Enter your number'),
  // ...passwordSchema,
  // password: yup
  //   .string()
  //   .required('Please Enter your password')
  //   .max(25, 'Password must be less than 25 characters')
  //   .matches(
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //     'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
  //   ),
  ...passwordSchema,
});
/** The `logInUpschema` object is defining the validation rules for the fields in a login form. It is
using the `yup` library to create a schema object with specific validation rules for each field. **/
const logInUpschema = yup.object().shape({
  email: yup
    .string()
    .email('email is not Valid')
    .min(3, 'Email must be valid')
    .max(50, 'Email must be valid')
    .required('Please Enter your email'),
  password: yup.string().required('Please Enter your password'),
});
/**  The `forgotSchema` object is defining the validation rules for the fields in a forgot password form.
It is using the `yup` library to create a schema object with specific validation rules for the email
field. **/
const forgotSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be valid')
    .required('Please Enter your email'),
});
/**  The `verificationSchema` is defining the validation rules for the fields in a verification form. It
is using the `yup` library to create a schema object with specific validation rules for the
`reset_code` field. **/
const verificationSchema = yup.object().shape({
  reset_code: yup
    .string()
    .required('Please Enter your verification code')
    .min(6, 'Verification code must be atleast 6 characters')
    .max(6, 'Verification code must be of 6 characters'),
});
/** The `resetPasswordScheme` object is defining the validation rules for the fields in a reset password
form. It is using the `yup` library to create a schema object with specific validation rules for the
`password` and `new_password` fields. **/
const resetPasswordScheme = yup.object().shape({
  password: yup
    .string()
    .required('Please Enter your password')
    .max(25, 'Password must be less than 25 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
  new_password: yup
    .string()
    .required('Please Enter your new password')
    .max(25, 'Password must be less than 25 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
});

/** The `addPlaylistScheme` constant is creating a validation schema for the fields in a form for adding
a playlist. It is using the `yup` library to define the validation rules for the `name` field. In
this case, the `name` field is required, meaning that it must be filled in by the user. If the user
does not enter a value for the `name` field, an error message will be displayed saying "Please enter
playlist name". **/
const addPlaylistScheme = yup.object().shape({
  name: yup.string().required('Please enter playlist name'),
});
const reviewScheme = yup.object().shape({
  review: yup.string().required('Please enter review'),
});
const addUsernameScheme = yup.object().shape({
  username: yup.string().required('Please enter name'),
});

/** The `editProfileScheme` constant is creating a validation schema for the fields in a form for
editing a user's profile. It is using the `yup` library to define the validation rules for the
`name` field. **/
const editProfileScheme = yup.object().shape({
  name: yup
    .string()
    .required('Please Enter your fullname')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[A-Za-z .]*$/, 'Please Enter valid name')
    .min(2, 'Name must be atleast 2 characters')
    .max(50, 'Name must be of 50 characters'),
});

/** The `Schemas` object is defining a set of validation schemas for different forms in a JavaScript
application. Each key in the object represents a specific form, and the corresponding value is a
validation schema created using the `yupResolver` function from the `@hookform/resolvers/yup`
library. **/
const Schemas = {
  signUp: yupResolver(signUpschema),
  logIn: yupResolver(logInUpschema),
  forgot: yupResolver(forgotSchema),
  newPassword: yupResolver(resetPasswordScheme),
  verification: yupResolver(verificationSchema),
  playlist: yupResolver(addPlaylistScheme),
  username: yupResolver(addUsernameScheme),
  editProfile: yupResolver(editProfileScheme),
  reviewSend: yupResolver(reviewScheme),
};

export default Schemas;
