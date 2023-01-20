import {getDocs, getDoc, doc, collection, query, where,  documentId, writeBatch, addDoc } from 'firebase/firestore'
import { db } from './index'
import { createAdaptedProductFromFirestore } from '../../adapters/productAdapter'
import { createAdaptedNavbarFromFirestore } from '../../adapters/navbarAdapter'




export const getProducts = (categoryId) => {
        const collectionRef = !categoryId 
            ? collection(db, 'products')
            : query(collection(db, 'products'), where('category', '==', categoryId))

        return getDocs(collectionRef).then(response => {
            const productsAdapted = response.docs.map(doc => {
                return createAdaptedProductFromFirestore(doc)
            })
            return productsAdapted
        }).catch(error => {
            return error
        })
}

export const getProductsId = (productId) => {
    return getDoc(doc(db, 'products', productId)).then(response => {
        const data = response.data()
        const productAdapted = { id: response.id, ...data}
        return productAdapted
    }).catch(error => {
        return error
    })
}

export const getNavbar = (categories) => {

        const collectionCategories = collection(db, 'categories');

        return getDocs(collectionCategories).then((response)=> {
                const categories = response.docs.map((snap) => {
                    return createAdaptedNavbarFromFirestore(snap)
                });
                return categories;
            });
}

export const getCheckout = async (objOrder, cart, clearCart) => {

    let orderAdded = []

    const ids = cart.map(prod => prod.id)
    
    const productsRef = collection(db, 'products')

    const productsAddedFromFirestore = await getDocs(query(productsRef, where(documentId(), 'in', ids)))
    
    const { docs } = productsAddedFromFirestore

    const outOfStock = []

    const batch = writeBatch(db)

    docs.forEach(doc => {
        const dataDoc = doc.data()
        const stockDb = dataDoc.stock

        const productAddedToCart = cart.find(prod => prod.id === doc.id)
        const prodQuantity = productAddedToCart?.quantity

        if(stockDb >= prodQuantity) {
            batch.update(doc.ref, { stock: stockDb - prodQuantity})
        } else {
            outOfStock.push({ id: doc.id, ...dataDoc})
        }
    })

    if(outOfStock.length === 0) {
        await batch.commit()

        const orderRef = collection(db, 'orders')
        orderAdded = await addDoc(orderRef, objOrder)

        clearCart()
        return orderAdded

    }
    return orderAdded
}