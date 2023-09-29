import { useEffect, useState } from "react"
import { db } from "../../../firebaseConfig"
import { getDocs, collection } from "firebase/firestore"
import { Link } from 'react-router-dom';
const ItemListContainer = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        let refCollection = collection(db, "products")
        getDocs(refCollection)
            .then((res) => {
                let newAarray = res.docs.map(product => {
                    return { ...product.data(), id: product.id }
                })
                setProducts(newAarray)
            })
            .catch((err) => console.log(err))
    }, [])
    console.log(products)

    return (
        <div>
            <h1>SHOP</h1>
            {products.map((product) => {
                return (
                    <Link key={product.id}>
                        <div >
                            <h4>{product.title}</h4>
                            <Link to={`/itemDetail/${product.id}`}>Ver Detalles</Link>
                            
                            <img src={product.image} style={{ width: 500 }} alt="" />
                            
                         
                        </div>

                    </Link>
                )
            })}
        </div>
    )
}

export default ItemListContainer
