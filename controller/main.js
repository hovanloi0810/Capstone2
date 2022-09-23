let productList = [];
let carts = [];

getProductClient();
function getProductClient() {
  getProductsApi()
    .then((response) => {
      let products = response.data;
      productList = [...products];
      productList.map((product) => {
        return new Products(
          product.name,
          product.price,
          product.screen,
          product.backCamera,
          product.frontCamera,
          product.img,
          product.desc,
          product.type
        );
      });

      ShowProductClient(products);
    })
    .catch((error) => {
      console.log(error);
    });
}

function selectType(typeProduct) {
  let products = [];
  for (let key in productList) {
    if (productList[key].type === typeProduct || 'All' === typeProduct) {
      products.push(productList[key]);
    }
  }
  ShowProductClient(products);
}

function ShowProductClient(products) {
  let output = products.reduce((total, value) => {
    return (
      total +
      `
        <div class="col-sm-4 col-md-3">
        <div class="product-shortcode style-1">
            <div class="title">
            <div class="simple-article size-1 color col-xs-b5">
                <a href="#">${value.type}</a>
            </div>
            <div class="h6 animate-to-green">
                <a href="#">${value.name}</a>
            </div>
            </div>
            <div class="preview">
              <img src="${value.img}" alt="" width=200px height=200px/>
              <div class="preview-buttons valign-middle">
                  <div class="valign-middle-content">
                  <a class="button size-2 style-2" href="#">
                      <span class="button-wrapper">
                      <span class="icon"
                          ><img src="img/icon-1.png" alt=""
                      /></span>
                      <span class="text">Learn More</span>
                      </span>
                  </a>
                  <a class="button size-2 style-3" href="#" onclick="getInfoProduct(${value.id})">
                      <span class="button-wrapper">
                      <span class="icon"
                          ><img src="img/icon-3.png" alt=""
                      /></span>
                      <span class="text" >Add To Cart</span>
                      </span>
                  </a>
                  </div>
              </div>
            </div>
            <div class="price">
                <span class="color">${value.price}</span>
            </div>
            <div class="description">
                <div class="simple-article text size-2">
                    <i>${value.desc}</i>
                    <br>
                    <b>Camera trước:</b>
                    ${value.frontCamera}
                    <br>
                    <b>Camera sau:</b>
                    ${value.backCamera}
                </div>
                
            <div class="icons">
                <a class="entry"
                ><i class="fa fa-check" aria-hidden="true"></i
                ></a>
                <a class="entry open-popup" data-rel="3"
                ><i class="fa fa-eye" aria-hidden="true"></i
                ></a>
                <a class="entry"
                ><i class="fa fa-heart-o" aria-hidden="true"></i
                ></a>
            </div>
            </div>
        </div>
        </div>
        `
    );
  }, "");
  dom("#listProduct").innerHTML = output;
}

function getInfoProduct(productIndex) {
  getProductByIdApi(productIndex)
    .then((response) => {
      let product = response.data;
      addProductToCart(product);
    })
    .catch((error) => {
      console.log(error);
    });
}

init();
function init() {
  carts = JSON.parse(localStorage.getItem("carts")) || [];
  carts = carts.map((cartItem) => {
    return new CartItems(cartItem.product, cartItem.quantity);
  });
  showProductCart(carts);
  renderCarts();
}

function addProductToCart(product) {
  let cartItem = new CartItems(product);
  // let cartItem = {
  //   product: {},
  //   quantity: 1,
  //   calcTotal: function() {
  //     return this.product.price * this.quantity;
  //   }
  // }
  // cartItem.product = product;
  // for (const key in productList) {
  //   if (productList[key].id === product.id) {
  //     carts.push(cartItem);
  //   }
  // }

  let checkCartItem = carts.filter((cartItem) => {
    return cartItem.product.id === product.id;
  });

  if (carts.length === 0 || checkCartItem.length === 0) {
    carts.push(cartItem);
    localStorage.setItem("carts", JSON.stringify(carts));
    showProductCart(carts);
    renderCarts();
    return;
  }

  let checkId = -1;
  for (let i = 0; i < carts.length; i++) {
    if (carts[i].product.id === product.id) {
      checkId = i;
    }
  }

  if (checkId !== -1) {
    carts[checkId].quantity += 1;
    localStorage.setItem("carts", JSON.stringify(carts));
    showProductCart(carts);
    renderCarts();
  }
}

function showProductCart(carts) {
  let itemHtml = carts.reduce((result, cartItem) => {
    return (
      result +
      `
        <div class="cart-entry clearfix">
        <a class="cart-entry-thumbnail" href="#"><img src="${
          cartItem.product.img
        }" width=85px height=85px alt=""></a>
       <div class="cart-entry-description">
         <table>
           <tbody><tr>
             <td>
               <div class="h6">
                 <a href="#">${cartItem.product.name}</a>
               </div>
               <div class="simple-article size-1">
                 QUANTITY: ${cartItem.quantity}
               </div>
             </td>
             <td>
               <div class="simple-article size-3 grey">
                 ${cartItem.product.price}
               </div>
               <div class="simple-article size-1">
                 TOTAL: ${cartItem.calcTotal()}
               </div>
             </td>
             <td data-title="Quantity: ">
                <div class="quantity-select">
                  <span class="minus" data-type="decrement" data-id="${
                    cartItem.product.id
                  }"></span>
                  <span class="number">${cartItem.quantity}</span>
                  <span class="plus" data-type="increment" data-id="${
                    cartItem.product.id
                  }"></span>
                </div>
              </td>
             <td>
               <div class="button-close" data-id=${
                 cartItem.product.id
               } data-type="delete"></div>
             </td>
           </tr>
         </tbody></table>
       </div>
      </div>
    `
    );
  }, "");

  dom(".cart-overflow").innerHTML = itemHtml;
}

function increaseQuantityCartItem(productId) {
  for (const key in carts) {
    if (carts[key].product.id === productId) {
      carts[key].quantity += 1;
      localStorage.setItem("carts", JSON.stringify(carts));
      showProductCart(carts);
      renderCarts();
    }
  }
}

function decreaseQuantityCartItem(productId) {
  for (const key in carts) {
    if (carts[key].product.id === productId) {
      if (carts[key].quantity >= 2) {
        carts[key].quantity -= 1;
        localStorage.setItem("carts", JSON.stringify(carts));
        showProductCart(carts);
        renderCarts();
      }
    }
  }
}

function removeProduct(productId) {
  carts = carts.filter((cartItem) => {
    return cartItem.product.id !== productId;
  })
  localStorage.setItem("carts", JSON.stringify(carts));
  renderCarts();
  showProductCart(carts);
}

function clearCarts() {
  // carts = [];
  carts.splice(0,carts.length)
  renderCarts();
  showProductCart(carts);
  localStorage.setItem("carts", JSON.stringify(carts));
}

function renderCarts() {
  let total = carts.reduce((total, cartItem) => {
    return (total += cartItem.calcTotal());
  }, 0);

  let countCartItem = carts.reduce((count) => {
    return (count += 1);
  }, 0);
  dom("#total").innerText = "$" + total;
  dom(".cart-title.hidden-xs").innerText = "$" + total;
  dom(".cart-label").innerText = countCartItem;
}

dom(".cart-overflow").addEventListener("click", (evt) => {
  let typeBtn = evt.target.getAttribute("data-type");
  let productId = evt.target.getAttribute("data-id");

  if (typeBtn === "increment") {
    increaseQuantityCartItem(productId);
  } else if (typeBtn === "decrement") {
    decreaseQuantityCartItem(productId);
  } else if (typeBtn === "delete") {
    removeProduct(productId);
  }
});

dom(".row").addEventListener("click", (evt) => {
  console.log(evt.target);
  if (evt.target.getAttribute("data-type") === "clear") {
    clearCarts();
  }
});

function dom(selector) {
  return document.querySelector(selector);
}
