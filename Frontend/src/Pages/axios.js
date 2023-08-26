// import axios from "axios";

// const token = localStorage.getItem("accessToken");
// const api = axios.create({
//   baseURL: "http://localhost:8080/api/v1",
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });
// export { api };

import axios from "axios";

const token = localStorage.getItem("accessToken");
// Read the backend base URL from the environment variable
const backendBaseUrl =
  process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: backendBaseUrl,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export { api };
