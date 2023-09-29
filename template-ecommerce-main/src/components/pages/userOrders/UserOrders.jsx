import { useContext, useEffect, useState } from "react"
import { db } from "../../../firebaseConfig"
import { getDocs, collection, query, where } from "firebase/firestore"
import { AuthContext } from '../../../context/AuthContext'

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollections = collection(db, 'orders')
      const ordersFiltered = query(ordersCollections, where('email', '==', user.email))
      try {
        const querySnapshot = await getDocs(ordersFiltered)
        const newArr = querySnapshot.docs.map(order => {
          return { ...order.data(), id: order.id }
        })
        setMyOrders(newArr)
      } catch (err) {
        console.log(err)
      }
    }

    fetchOrders()
  }, [user.email])

  return (
    <div>
      <h1>Mis Compras</h1>
      {
        myOrders.map(order => {
            return <div key={order.id} style={{border: '1px solid black'}}>
              {
                order?.items?.map(product => {
                  return <div key={product.id}>
                    <h2>{product.title}</h2>
                    <h3>{product.quantity}</h3>
                  </div>
                })
              }
                    <h4>Total de la orden {order.total}</h4>
            </div>
        })
      }
    </div>
  )
}

export default UserOrders