import { Routes, Route } from "react-router-dom";
import { ProductProvider } from "./Context/ProductContext";
import { AuthProvider } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";
import HomePage from "./Components/HomePage";
import Fashion from "./Components/Fashion";
import Electronics from "./Components/Electronics";
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";
import HomeAndKitchen from "./Components/Home&Kitechen";
import BeautyAndHealth from "./Components/Beauty&Health";
import SportsAndFitness from "./Components/Sports&Fitness";
import BooksAndHobbies from "./Components/Books&Hobbies";
import ToysAndGames from "./Components/Toys&Games";
import AdminLogin from "./Components/auth/AdminLogin";
import Login from "./Components/auth/Login";
import SignUp from "./Components/auth/SignUp";
import Admin from "./Components/Admin";
import AddProduct from "./Components/AddProduct";
import Search from "./Components/Search";
import ProductDetail from "./Components/ProductDetail";
import UserProfile from "./Components/UserProfile";

function App(){
  return(
    <AuthProvider>
      <ProductProvider>
        <div className="">
          <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Fashion" element={<Fashion/>} />
          <Route path="/Electronics" element={<Electronics/>} />
          <Route path="/HomeAndKitchen" element={<HomeAndKitchen/>} />
          <Route path="/BeautyAndHealth" element={<BeautyAndHealth/>} />
          <Route path="/SportsAndFitness" element={<SportsAndFitness/>} />
          <Route path="/BooksAndHobbies" element={<BooksAndHobbies/>} />
          <Route path="/ToysAndGames" element={<ToysAndGames/>} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/SignUp" element={<SignUp/>} />
          <Route path="/AdminLogin" element={<AdminLogin/>} />
          <Route path="/Admin" element={<Admin/>} />
          <Route path="/AddProduct" element={<AddProduct/>} />
          <Route path="/Cart" element={<Cart/>} />
          <Route path="/Wishlist" element={<Wishlist/>} />
          <Route path="/search" element={<Search/>} />
          <Route path="/product/:id" element={<ProductDetail/>} />
          <Route path="/profile" element={<UserProfile/>} />
        </Routes>
      </div>
      </ProductProvider>
    </AuthProvider>
  )
}
export default App