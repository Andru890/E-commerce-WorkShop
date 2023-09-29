import { createContext, useState } from "react"

export const CartContex = createContext()

const CartContexComponent = ({ children }) => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || [])

    const addToCart = (product) => {
        let existe = cart.some(e => e.id === product.id)
        if (existe) {
            // cambio de cantidades y agregar al nuevo arreglo
            let newArr = cart.map(elemento => {
                if (elemento.id === product.id) {
                    return { ...elemento, quantity: product.quantity }
                } else {
                    return elemento
                }
            })
      
            localStorage.setItem('cart', JSON.stringify(newArr))
            setCart(newArr)
        } else {
            localStorage.setItem('cart', JSON.stringify([...cart, product]))
            setCart([...cart, product])
        }
    }

    const getQuantityById = (id) => {
        let product = cart.find(elemento => elemento.id === id)
        return product?.quantity
    }

    const clearCart = () => {
        setCart([])
        localStorage.removeItem('cart')
    }

    const deleteById = (id) => {

        const newArr = cart.filter(elemento => elemento.id !== id)
        localStorage.setItem('cart',JSON.stringify(newArr) )
        setCart(newArr)
    }

    const getTotalPrice = ()=> {
        const total = cart.reduce((acc, elemento)=>{
            return acc + (elemento.unit_price * elemento.quantity)
        }, 0)
        return total
    }


    let data = {
        cart,
        addToCart,
        getQuantityById,
        clearCart,
        deleteById,
        getTotalPrice
    }

    return (
        <CartContex.Provider value={data}>
            {children}
        </CartContex.Provider>
    )
}

export default CartContexComponent