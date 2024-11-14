import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

function ProductManagement() {
    const [productData, setProductData] = useState({
        name: '', description: '', category: '', price: '', quantity: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5300/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
            alert('Error fetching products.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await fetch(`http://localhost:5300/products/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                setIsEditing(false);
                setEditId(null);
            } else {
                await fetch('http://localhost:5300/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }
            await fetchProducts(); 
            setProductData({ name: '', description: '', category: '', price: '', quantity: '' });
        } catch (error) {
            console.error(error);
            alert('Error while saving product.');
        }
    };

    const handleEdit = (product) => {
        setProductData(product);
        setIsEditing(true);
        setEditId(product.id);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5300/products/${id}`, {
                method: 'DELETE'
            });
            await fetchProducts(); 
        } catch (error) {
            console.error(error);
            alert('Error while deleting product.');
        }
    };

    const handleSell = async (product) => {
        if (product.quantity > 0) {
            const updatedProduct = { ...product, quantity: product.quantity - 1 };
            try {
                await fetch(`http://localhost:5300/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProduct)
                });
                await fetchProducts(); 
            } catch (error) {
                console.error(error);
                alert('Error while selling product.');
            }
        } else {
            alert('No more stock available to sell!');
        }
    };

    return (
        <section id="productManagement">
            <h2>Product Management</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={productData.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={productData.category}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={productData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                />
                <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
            </form>

            <h3>Product List</h3>
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>{parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                                        <button className="sell-button" onClick={() => handleSell(product)}>Sell</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No products available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ProductManagement;