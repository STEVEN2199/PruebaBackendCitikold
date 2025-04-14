import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from "../../api/apiClient";

const EditProductForm = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({ name: '', description: '', price: '', stockQuantity: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken } = useAuth();
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchProductToEdit = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiClient.get(`/Products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setProduct(response.data);
            } catch (error) {
                setError('Error al cargar los detalles del producto para editar.');
                console.error('Error al cargar detalle del producto:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken && id) {
            fetchProductToEdit();
        }
    }, [authToken, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await apiClient.put(`/Products/${id}`, product, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Producto actualizado exitosamente:', product);
            navigate('/products'); // Volver a la lista de productos después de la edición
        } catch (error) {
            setError('Error al actualizar el producto.');
            console.error('Error al actualizar el producto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/products');
    };

    if (loading) {
        return <p>Cargando detalles del producto para editar...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Editar Producto</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Descripción:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                        Precio:
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                        Cantidad:
                    </label>
                    <input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        value={product.stockQuantity}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Guardar
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductForm;