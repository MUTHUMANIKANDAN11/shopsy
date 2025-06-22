import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSumary } from "./checkout/paymentSummary.js";
import { loadProductFromBackend } from "../data/products-class.js";
import { getCart, isAuthenticated } from "./utils/api.js";

//import '../data/cart-class.js';
//import "../data/products-class.js";
//import "../data/car-class.js";
//import "../data/backend-practice.js";


async function loadCheckoutPage(){
    // Check if user is authenticated
    if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to signin page');
        window.location.href = 'signin.html';
        return;
    }

    try {
        await loadProductFromBackend();
        const cart = await getCart();
        // Pass cart to order summary and payment summary rendering if needed
        renderOrderSummary(cart);
        renderPaymentSumary(cart);
    } catch (error) {
        console.error('Error loading checkout page:', error);
        if (error.message === 'Invalid token') {
            // Token is invalid, redirect to signin
            window.location.href = 'signin.html';
        } else {
            // Other error, show user-friendly message
            alert('Unable to load checkout page. Please try again later.');
        }
    }
}

loadCheckoutPage();

/*
loadProductFromBackend(() => {
    renderOrderSummary();
    renderPaymentSumary();
});
*/