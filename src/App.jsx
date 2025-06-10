import { useState, useEffect } from "react"
import axios from "axios"

import { Card, CardContent, CardTitle } from "@/components/components/ui/card"
import { Skeleton } from "@/components/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/components/ui/alert"
import { Button } from "@/components/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/components/ui/dialog"

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get("https://fakestoreapi.com/products")

      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error("No products found.")
      }

      setProducts(response.data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products.")
    } finally {
      setLoading(false)
    }
  }

  const openModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(searchInput)
    }
  }
  // const filteredProducts = products.filter((product) =>
  //   (product.title + " " + product.category)
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // )
  
  const categories = ["All", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.title + " " + product.category)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })


  return (
    <div className="p-6 px-20">
      <h1 className="text-3xl font-bold mb-10 text-center">E-Commerce</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full max-w-md p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="pt-5 pb-2 bg-white">
              <CardContent className="p-4 space-y-2">
                <div className="w-full h-48 bg-gray-200 rounded mb-4" />
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="h-4 w-1/4 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full flex justify-center">
            <div className="bg-red-100 text-red-700 p-4 rounded w-full max-w-md text-center">
              <h2 className="font-bold text-lg mb-2">Error</h2>
              <p>{error}</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No results found.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => openModal(product)}
              className="transition duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-lg bg-white cursor-pointer pt-5 pb-2"
            >
              <CardContent className="p-4 space-y-2 text-black">
                <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />
                <CardTitle className="text-base mt-5">{product?.title || "N/A"}</CardTitle>
                <p className="text-sm text-muted-foreground">Price: ${product?.price ?? "N/A"}</p>
                <p className="text-sm text-muted-foreground">Category: {product?.category || "N/A"}</p>
                <p className="text-sm text-green-600 font-medium">Rating: {product?.rating?.rate ?? "N/A"}</p>
              </CardContent>
            </Card>
          ))
        )}

      </div>

      {/* Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-4xl bg-white text-black">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              <img
                src={selectedProduct?.image || ""}
                alt={selectedProduct?.title || "N/A"}
                className="w-full h-60 object-contain mt-5 mb-4"
              />
              <p><strong>Price:</strong> ${selectedProduct?.price ?? "N/A"}</p>
              <p><strong>Category:</strong> {selectedProduct?.category || "N/A"}</p>
              <p><strong>Rating:</strong> {selectedProduct?.rating?.rate ?? "N/A"} </p>
              <p><strong>Description:</strong> {selectedProduct?.description || "N/A"}</p>
              <p><strong>Available Stock:</strong> {selectedProduct?.rating?.count ?? "N/A"}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
