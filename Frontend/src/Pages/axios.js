import axios from "axios";

const token = localStorage.getItem("accessToken");
  const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export {api}

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api/v1",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// export { api };

