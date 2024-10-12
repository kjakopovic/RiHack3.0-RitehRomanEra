import Axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const baseURL = `https://agw3r0w73c.execute-api.eu-central-1.amazonaws.com/api-v1`;

export const axiosPublic = Axios.create({
  baseURL,
  headers,
});
export const axiosPrivate = Axios.create({
  baseURL,
  headers,
  withCredentials: true,
});