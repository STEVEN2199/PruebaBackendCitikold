import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const EditProductForm = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({ name: '', description: '', price: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken } = useAuth();
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchProductToEdit = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`https://localhost:7193/api/Products/${id}`, {
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
            await axios.put(`https://localhost:7193/api/Products/${id}`, product, {
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
        <div>
            <h2>Editar Producto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input type="text" id="name" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <textarea id="description" name="description" value={product.description} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="price">Precio:</label>
                    <input type="number" id="price" name="price" value={product.price} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={loading}>Guardar</button>
                <button type="button" onClick={handleCancel}>Cancelar</button>
            </form>
        </div>
    );
};

export default EditProductForm;