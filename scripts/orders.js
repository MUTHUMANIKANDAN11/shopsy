import { getOrders } from "./utils/api.js";
import { matchingProductItem } from "../data/products.js";
import { moneyFormat } from "../others/money-format.js";

async function renderOrdersPage() {
    let ordersHTML = '';
    let orders = [];
    try {
        orders = await getOrders();
    } catch (e) {
        orders = [];
    }

    if (!orders || orders.length === 0) {
        ordersHTML = '<div class="empty-indication">You have no orders yet.</div>';
        document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
        return;
    }

    orders.forEach((order) => {
        let productsHTML = '';

        order.products.forEach((product) => {
            const matchedProduct = matchingProductItem(product.productId);
            const date = new Date(product.estimatedDeliveryTime);
            const datenum = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });
            productsHTML += 
            `<div class="product-image-container">
                <img src="${matchedProduct.image}">
            </div>

            <div class="product-details">
                <div class="product-name">
                ${matchedProduct.name}
                </div>
                <div class="product-delivery-date">
                Arriving on: ${month} ${datenum}
                </div>
                <div class="product-quantity">
                Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.productId}">
                <img class="buy-again-icon" src=".//images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
                </button>
            </div>

            <div class="product-actions">
                <a>
                <button class="track-package-button button-secondary js-track-package-button" 
                    data-product-name="${matchedProduct.name}"
                    data-product-image="${matchedProduct.image}"
                    data-product-date="${product.estimatedDeliveryTime}"
                    data-product-quantity="${product.quantity}"
                    data-product-order="${order.orderTime}"
                >
                    Track package
                </button>
                </a>
            </div>
            `;
        });

        const date = new Date(order.orderTime);
        const datenum = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });

        ordersHTML += 
        `<div class="order-container">
            <div class="order-header">
            <div class="order-header-left-section">
                <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${month} ${datenum}</div>
                </div>
                <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>${moneyFormat(order.totalCostCents)}</div>
                </div>
            </div>

            <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.orderId || order.id}</div>
            </div>
            </div>

            <div class="order-details-grid">
            ${productsHTML}
            </div>
        </div>
        `
    });

    document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

    document.querySelectorAll('.js-buy-again-button').forEach((button) => {
        button.addEventListener('click', () => {
            // You can implement buy again logic here using backend cart API
            alert('Buy again feature coming soon!');
        });
    });

    document.querySelectorAll('.js-track-package-button').forEach((button) => {
        button.addEventListener('click', () => {
            const name = button.dataset.productName;
            const image = button.dataset.productImage;
            const date = button.dataset.productDate;
            const quantity = button.dataset.productQuantity;
            const orderTime = button.dataset.productOrder;

            const param = new URLSearchParams({
                name,
                image,
                date,
                quantity,
                orderTime
            });
            
            window.location.href = `./tracking.html?${param.toString()}`;
        });
    });
}

renderOrdersPage();