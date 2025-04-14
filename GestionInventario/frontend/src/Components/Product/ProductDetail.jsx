import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Obteneción del token
import apiClient from "../../api/apiClient";
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            setError('');
            setProduct(null);
            try {
                const response = await apiClient.get(`/Products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setProduct(response.data);
            } catch (error) {
                setError('Error al cargar los detalles del producto.');
                console.error('Error al cargar detalle del producto:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken && id) {
            fetchProductDetail();
        } else if (!authToken) {
            setError('No estás autenticado para ver los detalles del producto.');
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [authToken, id]);

    if (loading) {
        return <p>Cargando detalles del producto...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!product) {
        return <p>Producto no encontrado.</p>;
    }

    const handleGoBack = () => {
        navigate(-1); // Navega a la página anterior en el historial
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Producto</h2>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 text-base mb-2">
                    <span className="font-semibold">Descripción:</span> {product.description || 'No disponible'}
                </p>
                <p className="text-green-600 text-lg font-semibold mb-4">
                    Precio: ${parseFloat(product.price).toFixed(2)}
                </p>
        
                {product.stockQuantity !== undefined && (
                    <p className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Stock:</span> {product.stockQuantity} unidades
                    </p>
                )}
                
                {product.createdAt && (
                    <p className="text-gray-700 text-xs">
                        <span className="font-semibold">Creado el:</span> {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                )}
                {product.updatedAt && (
                    <p className="text-gray-700 text-xs">
                        <span className="font-semibold">Actualizado el:</span> {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                )}

                <button
                    onClick={handleGoBack}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Regresar
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;