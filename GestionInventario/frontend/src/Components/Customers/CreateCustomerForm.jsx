import React, { useState } from 'react';
//import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Si la creación de clientes requiere autenticación
import { useNavigate } from 'react-router-dom';
import apiClient from "../../api/apiClient";

const CreateCustomerForm = () => {
    const [name, setName] = useState('');
    const [ruc, setRuc] = useState('');
    const [email, setEmail] = useState('');
    const [cellphoneNumber, setCellphoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { authToken } = useAuth(); // Obtén el token si es necesario
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const newCustomer = {
                name: name,
                ruc: ruc,
                email: email,
                cellphoneNumber: cellphoneNumber,
                address: address,
                // Agrega aquí cualquier otra propiedad que el backend espere
            };

            const response = await apiClient.post("/Customers/customerDto", newCustomer, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Incluye el token si es necesario
                },
            });

            console.log('Cliente creado exitosamente:', response.data);
            // Puedes mostrar un mensaje de éxito o redirigir a otra página
            navigate('/products'); // Redirigir a la lista de clientes
        } catch (error) {
            setError('Error al crear el cliente.');
            console.error('Error al crear el cliente:', error);
            if (error.response && error.response.data) {
                console.error('Detalles del error:', error.response.data);
                setError(`Error al crear el cliente: ${JSON.stringify(error.response.data)}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/products'); // Regresar a la lista de clientes
    };

    const handleReset = () => {
        setName('');
        setRuc('');
        setEmail('');
        setCellphoneNumber('');
        setAddress('');
        setError('');
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Cliente</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre:
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="ruc" className="block text-gray-700 text-sm font-bold mb-2">
                        RUC:
                    </label>
                    <input
                        type="text"
                        id="ruc"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={ruc}
                        onChange={(e) => setRuc(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                        Teléfono:
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={cellphoneNumber}
                        onChange={(e) => setCellphoneNumber(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                        Dirección:
                    </label>
                    <textarea
                        id="address"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Crear Cliente
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-white-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                        onClick={handleReset}
                    >
                        Resetear
                    </button>
                    <button
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default CreateCustomerForm;