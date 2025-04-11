import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Para obtener el token

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            setError('');
            setProduct(null);
            try {
                const response = await axios.get(`https://localhost:7193/api/Products/${id}`, {
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

    return (
        <div>
            <h2>Detalles del Producto</h2>
            <h3>{product.name}</h3>
            <p>Descripción: {product.description}</p>
            <p>Precio: ${product.price}</p>
            {/* Puedes mostrar más detalles aquí */}
        </div>
    );
};

export default ProductDetail;