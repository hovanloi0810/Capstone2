function getProductsApi() {
    return axios({
        url: "https://63185e1ff6b281877c6a3e72.mockapi.io/Products",
        method: "GET",
      });
}

function getProductByIdApi(productIndex) {
  return axios({
    url: `https://63185e1ff6b281877c6a3e72.mockapi.io/Products/${productIndex}`,
    method: 'GET',
  })
}