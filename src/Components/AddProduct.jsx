import { useState, useContext } from "react";
import { ProductContext } from "../Context/ProductContext";
import Header from "./Header";
import SecondNav from "./SecondNav";
import { useNavigate } from "react-router-dom";

function AddProduct(){
    const { addProduct } = useContext(ProductContext);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Fashion");

    const handleAddProduct = () => {
        if (!name || !price || !image) {
            alert("Name, price, and image are required!");
            return;
        }
        addProduct({ id: Date.now(), name, price, description, category, image });
        alert("Product added successfully!");
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
        navigate(`/${category}`);
    };
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Base64 string survives refresh
            };
            reader.readAsDataURL(file);
        } else {
            alert("Only PNG or JPEG allowed");
        }
    };
    return(
        <div>
            <div className="fixed top-0 left-0 w-full z-50 bg-white">
                <Header />
                <SecondNav />
            </div>
            <div className="pt-40">
                <div className="w-1/2 min-w-[300px] mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md shadow-md">
                    <h1 className="text-center text-2xl font-bold p-3 text-white">Add Product</h1>
                </div>
            <div className="flex flex-col items-center justify-center mt-8 p-2 w-[400px] mx-auto gap-3">
                <input type="text" placeholder="Product Name" className="w-full border border-gray-300 rounded-md p-2 mb-2" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="number" placeholder="Product Price" className="w-full border border-gray-300 rounded-md p-2 mb-2" value={price} onChange={(e) => setPrice(e.target.value)}/>
                <input type="text" placeholder="Product Description" className="w-full border border-gray-300 rounded-md p-2 mb-2" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <select className="w-full border border-gray-300 rounded-md p-2 mb-2 bg-white outline-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="HomeAndKitchen">Home & Kitchen</option>
                    <option value="BeautyAndHealth">Beauty & Health</option>
                    <option value="SportsAndFitness">Sports & Fitness</option>
                    <option value="BooksAndHobbies">Books & Hobbies</option>
                    <option value="ToysAndGames">Toys & Games</option>
                </select>
            </div>
            <div className="flex flex-col items-center gap-4">

      {/* Big Box */}
      <div className="w-[400px] h-[250px] border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center overflow-hidden">
        
        {image ? (
          <img src={image} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400">No Image Selected</p>
        )}

      </div>

      {/* Hidden Input */}
      <input 
        type="file" 
        accept="image/png, image/jpeg"
        id="fileInput"
        className="hidden"
        onChange={handleImage}
      />

      {/* Plus Button */}
      <label 
        htmlFor="fileInput"
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
      >
        {/* Plus Icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
        </svg>

        Add Image
      </label>

    </div>
    <div className="flex items-center justify-center space-x-4 mt-16 p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md hover:bg-gradient-to-l from-indigo-500 to-purple-500 cursor-pointer" onClick={handleAddProduct}>
    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 hover:cursor-pointer font-bold">Add Product</button>
    </div>
            </div>
        </div>
    )
}
export default AddProduct