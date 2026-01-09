export const getYupErrors = (yupError) => {
  const errors = {};

  if (yupError.inner) {
    yupError.inner.forEach((err) => {
      if (!errors[err.path]) {
        errors[err.path] = err.message;
      }
    });
  }

  return errors;
};
