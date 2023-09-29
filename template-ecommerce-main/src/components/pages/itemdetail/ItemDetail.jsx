import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../../firebaseConfig"
import { getDoc, collection, doc } from "firebase/firestore"
import { Button } from "@mui/material"
import { CartContex } from "../../../context/CartContex"



const ItemDetail = () => {
  
    const { id } = useParams()
    const {addToCart, getQuantityById} = useContext(CartContex)
    let quantity = getQuantityById(id)
    const [product, setProduct] = useState(null)
    const [counter, setCounter] = useState(quantity || 1)

    
  

    useEffect(() => {
        let refCollection = collection(db, 'products')
        let refDoc = doc(refCollection, id)
        getDoc(refDoc)
            .then(res => setProduct({ ...res.data(), id: res.id }))
            .catch(err => console.log(err))
    }, [id])
    
    // SUMAR
    const addOne = ()=>{
        if(counter < product.stock){
            setCounter(counter +1)
        }else{
            alert('Stock maximo')
        }
    }
    // RESTAR
    const SubOne = ()=>{
        if(counter > 1){
            setCounter(counter -1)
        }else{
            alert('Stock minimo de un producto')
        }
    }
    // CARRITO

    const  onAdd =()=>{
        let obj = {
            ...product,
            quantity: counter
        }
        console.log(obj)
        addToCart(obj)
    }
    


    return (
        <div>
            <h2>Detalles</h2>
            {
                product && (  <div>
                    <h4>{product.title}</h4>
                    <h4>{product.unit_price}Usd</h4>
                    <h4>Stock: {product.stock}</h4>
                    <img src={product.image} style={{ width: 400 }} alt="" />
                </div>
            )}
            {
                quantity && <h5>Ya tienes {quantity} Ipad en tu carrito</h5>
            }
            {
                product?.stock === quantity  && <h6>Ya tienes el máximo en el carrito</h6>
            }
            <div style={{ display: "flex" }}>
                <Button variant="contained" onClick={addOne}>+</Button>
                <h3 style={{ margin: 5 }}>{counter}</h3>
                <Button variant="contained" onClick={SubOne}>-</Button>
            </div>
            <Button onClick={onAdd}>Agregar el carrito</Button>
        </div>
    )
}

export default ItemDetail
