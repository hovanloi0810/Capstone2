class CartItems {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    calcTotal() {
        return this.product.price * this.quantity;
    }
}