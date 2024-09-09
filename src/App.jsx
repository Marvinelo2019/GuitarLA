import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Guitar from "./Components/Guiatar";
import { db } from "./data/db";

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart') //si no hay nada en localstorage envia un null
    return localStorageCart ? JSON.parse(localStorageCart) : [] //sino hay nada agrega un arreglo vacio
  }

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

//LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
  //Agregar items al carrito
  function addToCart(item) {

    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
   if(itemExists >=0) { //Existe en el carrito
    if(cart[itemExists].quantity >= MAX_ITEMS) return //valida que no exceda del maximo de items.
    const updateCart = [...cart] //Toma una copia del state original
    updateCart[itemExists].quantity++ //Realiza los cambios o los incrementos
    setCart(updateCart) //envia datos para setear
   }else {
    item.quantity = 1
    setCart([...cart, item])
   }
  }
// Remover items del carrito
  function removeFromCart(id){
   setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }
//boton incrementar items
  function increaseQuantity(id){
   const updateCart = cart.map( item => {
    if(item.id == id && item.quantity < MAX_ITEMS){ //identifica al elementos que se le da click y valida que no sea mayor a 5
      return {
        ...item, //mantengo imagen, nombre, precio tal cual esta
        quantity: item.quantity + 1 //Incrementar la cantidad a uno
      }
    }
    return item //El resto de elementos se mantienen intactos
   })
    setCart(updateCart)
  }
//boton decrementar items 
  function decreaseQuiantity(id){
    const updateCart = cart.map( item => {
      if(item.id == id && item.quantity > MIN_ITEMS){ //identifica al elementos que se le da click y valida que no sea mayor a 5
        return {
          ...item,//mantengo imagen, nombre, precio tal cual esta
          quantity: item.quantity - 1//Decrementar la cantidad a uno
        }
      }
        return item
    })
    setCart(updateCart)
  }

//boton limpiar el carrito de compras 
  function clearCart(){
    setCart([])
  }


  return (
    <>
      <Header
        cart= {cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuiantity={decreaseQuiantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar 
            key={guitar.id} 
            guitar={guitar} 
            setCart={setCart}
            addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
