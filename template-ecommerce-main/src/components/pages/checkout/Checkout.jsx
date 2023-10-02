import { useContext, useEffect, useState } from "react"
import { CartContex } from "../../../context/CartContex"
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"
import axios from "axios"
import { Button, TextField } from "@mui/material"
import { AuthContext } from "../../../context/AuthContext"
import { useLocation } from "react-router-dom"
import { db } from "../../../firebaseConfig"
import { addDoc, collection, doc, updateDoc,serverTimestamp, getDoc} from 'firebase/firestore'
const Checkout = () => {
    const { cart, getTotalPrice, clearCart } = useContext(CartContex)
    const { user } = useContext(AuthContext)
    initMercadoPago(import.meta.env.VITE_PUBLICKEY, { locale: 'es-AR' })

    const [preferenceId, setPreferenceId] = useState(null)
    const [userData, setUserdata] = useState({
        cp: '',
        phone: '',
        NyA: ''
    })

    const [orderId, setOrderId] = useState(null)
    const [shipmentCost,setShipmentCost] = useState(null)

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const paramValue = queryParams.get('status')

    useEffect(()=>{
        let order = JSON.parse(localStorage.getItem('order'))
        if(paramValue === 'approved'){
            let ordersCollections = collection(db, 'orders')
            addDoc(ordersCollections,{...order, date: serverTimestamp()})
            .then(res => {
                setOrderId(res.id)
            })
            order.items.forEach(element => {
                updateDoc(doc(db, 'products',element.id), {stock: element.stock - element.quantity})
            });
            localStorage.removeItem('order')
            clearCart()
        }
    },[paramValue])

    useEffect(()=>{
            let shipmentCollection = collection(db, 'shipment')
            let shipmentDoc = doc(shipmentCollection,'HvkkiWQ1SqVGW8vH6hkl')
            getDoc(shipmentDoc)
            .then(res => {
                setShipmentCost(res.data().cost)
            })
    }, [])




    let total = getTotalPrice()
    const createPreference = async () => {
        const newArray = cart.map(product => {
            return {
                title: product.title,
                unit_price: product.unit_price,
                quantity: product.quantity
            }
        })
        try {
            let response = await axios.post("https://backend-apple-qy2pv1ost-andru890.vercel.app/create_preference", {
                items: newArray,
                shipment_cost: shipmentCost
            })
            const { id } = response.data
            return id
        } catch (error) {
            console.log(error)
        }

    }




    const handleBuy = async () => {
        let order = {
            NyA: userData.NyA,
            cp: userData.cp,
            phone: userData.phone,
            items: cart, 
            total: total + shipmentCost,
            email: user.email
            
        }
        localStorage.setItem('order', JSON.stringify(order))
        const id = await createPreference()
        if (id) {
            setPreferenceId(id)
        }
    }

    const handleChange = (e)=>{
            setUserdata({...userData, [e.target.name]: e.target})
    }
    return (
        <div>
            <h1>CHECKOUT</h1>
            {
                !orderId ? <>
           
            <TextField name="NyA" variant="outlined" label='Nombre y Apellido' onChange={handleChange}/>
            <TextField name="cp" variant="outlined" label='Codigo Postal' onChange={handleChange}/>
            <TextField name="phone" variant="outlined" label='Celular' onChange={handleChange}/>
            <Button onClick={handleBuy}>Selección de pago</Button>
            </> : <>
            <h4>El pago se realizó con éxito</h4>
            <h4>Su numero de compra es {orderId}</h4>
            </>
            }   
            {
                preferenceId &&  <Wallet initialization={{preferenceId, redirectMode: 'self'}}/>
            }
       
        </div>
    )
}

export default Checkout


















