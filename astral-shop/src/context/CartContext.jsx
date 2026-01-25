// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    // Load initial cart from local storage if available
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItem");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItem", JSON.stringify(cartItems));
    }, [cartItems]);

    // Add Item
    function addToCart(product) {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    }

    // Remove Item
    function removeFromCart(id) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }

    // Update Quantity
    function updateQuantity(id, quantity) {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }

    // Clear Cart
    function clearCart() {
        setCartItems([]);
    }

    // Get Total Price
    function getCartTotal() {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get Cart Count
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        cartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
