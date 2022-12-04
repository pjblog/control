export function interceptRequestError(error: any) {
  if (error?.status){
    error.code = error.status;
    return Promise.reject(error);
  }
  if (error.response) return Promise.reject({
    code: error.response.status,
    message: error.response.data,
  })
  return Promise.reject({
    code: 500,
    message: error.message,
  })
}