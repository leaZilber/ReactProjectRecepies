// import React from 'react';
// import './App.css';
// import { UserProvider } from './userModel';
// import { RecipeApp222 } from './allRecipies';
// import HomePage from './homePage';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// function App() {
//   return (
//     <BrowserRouter>
//       <UserProvider>
//         <Routes>
//           <Route path="/RecipeApp222" element={<RecipeApp222 />} />
//           <Route path="/" element={<HomePage />} />
//           {/* <HomePage/> */}
//         </Routes>
//       </UserProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
// import "./App.css"
// import { UserProvider } from "./userModel"
// import HomePage from "./homePage"
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
// import React from "react"
// import { SignUp2 } from "./v0sign"
// import { Login2 } from "./v0login"
// import { AddRecipeForm } from "./addRecipeForm"
// import ShoppingList from "./shoppingList"

// function App() {
//   return (
//     <BrowserRouter>
//       <UserProvider>
//         <Routes>
//           <Route path="/allrecipes" element={<AllRecipes />} />
//           <Route path="/addrecipe" element={<AddRecipeForm />} />
//           <Route path="/shoppinglist" element={<ShoppingList />} />
//           <Route path="/login" element={<Login2 onBackClick={() => {}} />} />
//           <Route path="/signup" element={<SignUp2 onBackClick={() => {}} />} />
//           <Route path="/" element={<HomePage />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </UserProvider>
//     </BrowserRouter>
//   )
// }

// export default App

import "./App.css"
import { UserProvider } from "./userModel"
import { AllRecipes } from "./allRecipies"
import HomePage from "./homePage"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import React from "react"
import { Login2 } from "./login"
import { SignUp2 } from "./signIn"
import ShoppingList from "./shoppingList"
import { AddRecipeForm } from "./addRecipeForm"

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/allrecipes" element={<AllRecipes />} />
          <Route path="/addrecipe" element={<AddRecipeForm />} />
          <Route path="/shoppinglist" element={<ShoppingList />} />
          <Route path="/login" element={<Login2 onBackClick={() => {}} />} />
          <Route path="/signup" element={<SignUp2 onBackClick={() => {}} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App

