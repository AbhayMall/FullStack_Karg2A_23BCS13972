import React from 'react';
import { BrowserRouter, Routes, Route ,Link } from 'react-router-dom'
import './App.css'
import Todo from "./Todo";


function ProductCart({name,price,description,inStock}){
  const handleButton=()=>{
  alert(`${name}is added to the cart.`)
}
  return(
    <div style={{border:'1px solid gray',margin:'10px',padding:'10px',borderRadius:'10px'}}>
      <h2>{name}</h2>
      <p>Price:{price}</p>
      <p>description:{description}</p>
      {inStock ? (<button onClick={handleButton} style={{color:'green'}}>Buy Now</button>):(<button  style={{color:'red'}} disabled>Out of Stock</button>)}

     </div>
  );
}

function Home(){
return(
  <div>
      <h1>Welcome to CU Grocery.</h1>
      <h2>Below are the item : </h2>
    <ProductCart name='Mango ' price='100' description='Mango is healthy.' inStock={true} />
    <ProductCart name='Apple ' price='200'  description='Apple is healthy.' inStock={false} />
    <ProductCart name='Banana ' price='50'  description='Banana is healthy.' inStock={true}/>
  <br />
  <div>
    <Link to="/todo">
    <button>Go to do list app</button>
    </Link>

  </div>
 
  </div>
);
}
function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/todo' element={<Todo/>}/>

    </Routes>
    </BrowserRouter>

  )
}



export default App;
