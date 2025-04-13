import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link  } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Para obtener el token
//import styles from './ProductList.module.css'; // Importa los estilos

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stockQuantity: '' });


    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('https://localhost:7193/api/Products', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setProducts(response.data);
        } catch (error) {
            setError('Error al cargar los productos.');
            console.error('Error al cargar productos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchProducts();
        } else {
            setError('No estás autenticado para ver los productos.');
            setLoading(false);
        }
    }, [authToken]);


    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            setLoading(true);
            setError('');
            try {
                await axios.delete(`https://localhost:7193/api/Products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log(`Producto con ID ${id} eliminado exitosamente.`);
                // Volver a cargar la lista de productos después de la eliminación
                const response = await axios.get('https://localhost:7193/api/Products', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                setError('Error al eliminar el producto.');
                console.error('Error al eliminar el producto:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        setNewProduct({ name: '', description: '', price: '', stockQuantity: '' }); // Resetear el formulario
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateProduct = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('https://localhost:7193/api/Products', newProduct, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Producto creado exitosamente:', response.data);
            fetchProducts(); // Ahora 'fetchProducts' está definida en este alcance
            closeModal(); // Cerrar el modal después de la creación exitosa
        } catch (error) {
            setError('Error al crear el producto.');
            console.error('Error al crear el producto:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isModalOpen) {
        return <p className="text-center py-4">Cargando productos...</p>;
    }

    if (error) {
        return <p className="text-red-500 py-4">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold mb-4">Lista de Productos</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.name}</div>
                                </td>
                                <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-500">{product.description}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 font-semibold text-green-500">${product.price}</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="px-2 py-1 font-semibold text-green-500">{product.stockQuantity}</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-2">Ver</Link>
                                    <Link to={`/products/edit/${product.id}`} className="text-yellow-600 hover:text-yellow-900 mr-2">Editar</Link>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-white hover:text-red-900">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={openModal} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 mr-10">
                Agregar Nuevo Producto
            </button>

            <Link to="/orders/create" className="bg-green-500  text-white font-bold py-2 px-4 rounded mt-4 inline-block mr-10">
            Crear Nuevo Pedido
            </Link>

            <Link to="/customers/create" className="bg-green-500  text-white font-bold py-2 px-4 rounded mt-4 inline-block">
            Crear Nuevo Cliente
            </Link>

            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Agregar Nuevo Producto</h3>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
                                <input type="text" id="name" name="name" value={newProduct.name} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                                <textarea id="description" name="description" value={newProduct.description} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Precio:</label>
                                <input type="number" id="price" name="price" value={newProduct.price} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="stockQuantity" className="block text-gray-700 text-sm font-bold mb-2">Cantidad:</label>
                                <input type="number" id="stockQuantity" name="stockQuantity" value={newProduct.stockQuantity} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={handleCreateProduct} disabled={loading} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                                    Guardar
                                </button>
                                <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;