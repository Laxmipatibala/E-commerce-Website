import { useNavigate, useLocation } from "react-router-dom";

function SecondNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const categories = [
        { name: "Home", path: "/" },
        { name: "Fashion", path: "/Fashion" },
        { name: "Electronics", path: "/Electronics" },
        { name: "Home & Kitchen", path: "/HomeAndKitchen" },
        { name: "Beauty & Health", path: "/BeautyAndHealth" },
        { name: "Sports & Fitness", path: "/SportsAndFitness" },
        { name: "Books & Hobbies", path: "/BooksAndHobbies" },
        { name: "Toys & Games", path: "/ToysAndGames" },
    ];

    return (
        <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar py-2">
                <div className="flex items-center justify-start md:justify-center space-x-2 sm:space-x-4 min-w-max">
                    {categories.map((cat) => {
                        const isActive = location.pathname === cat.path;
                        return (
                            <button
                                key={cat.path}
                                onClick={() => navigate(cat.path)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                                    isActive 
                                    ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

export default SecondNav;