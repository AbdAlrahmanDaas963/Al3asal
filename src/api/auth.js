import apiClient from "./apiClient";

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  console.log("username", username);
  console.log("password", password);

  const response = await apiClient.post("/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // Typically includes token or user data
};
