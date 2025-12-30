import api from "../utils/axios";

/**
 * Login API
 * @param {string} username
 * @param {string} password
 */
export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

//   const response = await api.post(
//     "/api/v1/auth/token",
//     formData
//   );

//   return response.data;
// };
 const { data } = await api.post(
    "/api/v1/auth/token",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data;
};

export const signup = async ({ full_name, email, password }) => {
  const { data } = await api.post(
    "/api/v1/auth/register",
    {
      full_name,
      email,
      password,
    }
  );

  return data;
};