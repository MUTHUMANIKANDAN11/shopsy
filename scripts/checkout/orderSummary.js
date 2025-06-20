import { matchingProductItem } from "../../data/products-class.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSumary } from "./paymentSummary.js";
import { moneyFormat } from "../../others/money-format.js";
import { updateCartItem, updateCartDeliveryOption, getCart } from "../utils/api.js";

export function renderOrderSummary(cart) {
    let orderSummaryHTML = '';
    if (!cart || !cart.products || cart.products.length === 0) {
        orderSummaryHTML = '<div class="empty-indication">Your cart is empty.</div>';
        document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;
        renderPaymentSumary({ products: [] });
        return;
    }
    cart.products.forEach((cartItem) => {
        const matchedItem = matchingProductItem(cartItem.productId);
        const productId = matchedItem.id;
        const deliveryOptionId = String(cartItem.deliveryOptionId || '1');
        
        let deliveryOption;
        deliveryOptions.forEach((option) => {
            if(option.id === deliveryOptionId)
                deliveryOption = option;
        });

        const today = dayjs();
        const later = today.add(Number(deliveryOption.date), 'day');
        const dateString = later.format('dddd, MMMM D');

        orderSummaryHTML += `
            <div class="cart-item-container js-cart-item-container js-cart-item-container-${productId}">
            <div class="delivery-date">
                ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchedItem.image}">

                <div class="cart-item-details">
                <div class="product-name js-product-name-${productId}">
                    ${matchedItem.name}
                </div>
                <div class="product-price js-product-price-${productId}">
                    ${matchedItem.getPrice()}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <input type="number" min="1" class="quantity-input js-quantity-input-${productId}" value="${cartItem.quantity}" data-product-id="${productId}">
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionSummary(productId, cartItem.deliveryOptionId)}
                </div>
            </div>
            </div>
        `;
    });

    function deliveryOptionSummary(productId, deliveryOptionId){
        let deliveryOptionSummaryHTML = '';
        deliveryOptions.forEach((option) => {

            const today = dayjs();
            const later = today.add(Number(option.date), 'day');
            const dateString = later.format('dddd, MMMM D');

            let priceCentsString = option.priceCents;
            priceCentsString = (priceCentsString === 0) ? 'FREE' : `${moneyFormat(priceCentsString)} -`;

            let isChecked = false;
            if(option.id === deliveryOptionId) isChecked = true;
            isChecked = (isChecked) ? 'checked' : '';

            deliveryOptionSummaryHTML += `
                <div class="delivery-option js-delivery-option" data-product-id="${productId}" data-delivery-option-id="${option.id}">
                    <input type="radio" class="delivery-option-input" ${isChecked}
                    name="delivery-option-${productId}">
                    <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceCentsString} Shipping
                        </div>
                    </div>
                </div>
            `;
        });
        
        return deliveryOptionSummaryHTML;
    }

    document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;
    renderPaymentSumary(cart);

    // Quantity change handler
    document.querySelectorAll('.quantity-input').forEach((input) => {
        input.addEventListener('change', async (e) => {
            const productId = input.dataset.productId;
            const quantity = parseInt(input.value, 10);
            if (quantity > 0) {
                await updateCartItem(productId, quantity);
                const newCart = await getCart();
                renderOrderSummary(newCart);
            }
        });
    });

    // Delivery option change handler
    document.querySelectorAll('.js-delivery-option').forEach((option) => {
        option.addEventListener('click', async () => {
            const productId = option.dataset.productId;
            const deliveryOptionId = option.dataset.deliveryOptionId;
            await updateCartDeliveryOption(productId, deliveryOptionId);
            const newCart = await getCart();
            renderOrderSummary(newCart);
        });
    });
}