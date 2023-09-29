import { useContext } from "react"
import { CartContex } from "../../../context/CartContex"
import { Link } from "react-router-dom"



const Cart = () => {

  const { cart, clearCart, deleteById, getTotalPrice} = useContext(CartContex)
  let total = getTotalPrice()

  return (
    <div>
      <h1>CARRITO</h1>
      
 
      <button onClick={clearCart}>Limpiar carrito</button>
      {
        cart.map((product) => {
          return (
            <div key={product.id} style={{ width: '200px', border: '2px solid red' }}>
              <h4>{product.title}</h4>
              <h4> {product.quantity} </h4>
              <button onClick={()=> deleteById(product.id)}>Eliminar</button>
             
            </div>
          )
        })
      }
      <h5>El total a pagar es : {total}Usd </h5>
      
       {
        cart.length > 0 && <Link to='/checkout' style={{color: "steelblue"}}>Finalizar compra</Link>
      }
    </div>
  )
}

export default Cart
