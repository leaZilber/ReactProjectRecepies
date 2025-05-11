import "./App.css"
import { UserProvider } from "./userModel"
import { AllRecipes } from "./allRecipies"
import HomePage from "./homePage"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import React from "react"
import { Login } from "./login"
import { SignUp } from "./signIn"
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
          <Route path="/login" element={<Login onBackClick={() => {}} />} />
          <Route path="/signup" element={<SignUp onBackClick={() => {}} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App

