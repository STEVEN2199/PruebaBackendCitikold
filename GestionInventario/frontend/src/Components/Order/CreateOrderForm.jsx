import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Si necesitas autenticación
import { useDebounce } from "../../Hooks/useDebounce";
import { useNavigate } from 'react-router-dom';
import generateInvoicePDF from '../../Pdf/generateInvoicePDF';

const CreateOrderForm = () => {
    const [searchTermCustomer, setSearchTermCustomer] = useState('');
    const [searchResultsCustomers, setSearchResultsCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderDate, setOrderDate] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    const [searchTermProduct, setSearchTermProduct] = useState('');
    const [searchResultsProducts, setSearchResultsProducts] = useState([]);
    const [newOrderDetail, setNewOrderDetail] = useState({ productId: '', quantity: 1 });
    const [totalAmount, setTotalAmount] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [errorCustomers, setErrorCustomers] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [errorProducts, setErrorProducts] = useState('');

    const [term, setTerm] = useState("");

    const debouncedTerm = useDebounce(term);
  

    const { authToken } = useAuth(); // Si necesitas el token
    const navigate = useNavigate(); // Inicializa useNavigate

    // Función para buscar clientes
    // Función para buscar clientes
  const handleSearchCustomer = async () => {
    setSearchTermCustomer(term);
    if (debouncedTerm.length >= 3) {
      // Iniciar la búsqueda con al menos 3 caracteres
      setLoadingCustomers(true);
      setErrorCustomers("");
      try {
        const response = await axios.get(
          `https://localhost:7193/api/Customers/search?searchTerm=${debouncedTerm}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Si es necesario
            },
          }
        );
        console.log("Respuesta de búsqueda de clientes:", response.data);
        //setSearchResultsCustomers([{ id: 999, Nombre: 'PRUEBA', Ruc: '1234567890' }]);
        setSearchResultsCustomers(response.data);
      } catch (error) {
        setErrorCustomers("Error al buscar clientes.");
        console.error("Error al buscar clientes:", error);
      } finally {
        setLoadingCustomers(false);
      }
    } else {
      setSearchResultsCustomers([]);
      setSelectedCustomer(null);
    }
  };

    // Función para seleccionar un cliente de la lista
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSearchResultsCustomers([]);
        setSearchTermCustomer(`${customer.Nombre} (${customer.Ruc})`); // Mostrar nombre y RUC en el input
    };

    // Función para manejar la selección de la fecha del pedido
    const handleOrderDateChange = (event) => {
        const selectedDate = event.target.value;
        const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
        if (selectedDate <= today) {
            setOrderDate(selectedDate);
        } else {
            alert('La fecha del pedido no puede ser futura.');
            setOrderDate('');
        }
    };

    // Función para buscar productos (similar a buscar clientes)
    const handleSearchProduct = async (term) => {
        setSearchTermProduct(term);
        if (term.length >= 3) {
            setLoadingProducts(true);
            setErrorProducts('');
            try {
                const response = await axios.get(`https://localhost:7193/api/Products?name=${term}`, { // Ajusta el endpoint de búsqueda de productos si es diferente
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Si es necesario
                    },
                });
                
                setSearchResultsProducts(response.data);
            } catch (error) {
                setErrorProducts('Error al buscar productos.');
                console.error('Error al buscar productos:', error);
            } finally {
                setLoadingProducts(false);
            }
        } else {
            setSearchResultsProducts([]);
            setNewOrderDetail(prevState => ({ ...prevState, productId: '' }));
        }
    };

    // Función para seleccionar un producto para el detalle
    const handleSelectProduct = (product) => {
        setNewOrderDetail({ ...newOrderDetail, productId: product.id, unitPrice: product.price });
        setSearchResultsProducts([]);
        setSearchTermProduct(product.name);
    };

    // Función para manejar el cambio en la cantidad del producto
    const handleQuantityChange = (event) => {
        const quantity = parseInt(event.target.value, 10);
        if (quantity > 0) {
            // Aquí podrías hacer una llamada al backend para verificar el stock disponible
            setNewOrderDetail({ ...newOrderDetail, quantity });
        } else {
            alert('La cantidad debe ser mayor a cero.');
            setNewOrderDetail({ ...newOrderDetail, quantity: 1 });
        }
    };

    // Función para agregar un producto al detalle del pedido
    const handleAddOrderDetail = () => {
        if (newOrderDetail.productId && newOrderDetail.quantity > 0 && newOrderDetail.unitPrice !== undefined) {
            const productToAdd = searchResultsProducts.find(p => p.id === parseInt(newOrderDetail.productId, 10)) || { name: searchTermProduct, price: newOrderDetail.unitPrice };
            const newDetail = {
                productId: parseInt(newOrderDetail.productId, 10),
                productName: productToAdd.name,
                description: productToAdd.description,
                quantity: newOrderDetail.quantity,
                unitPrice: newOrderDetail.unitPrice,
                subtotal: newOrderDetail.quantity * newOrderDetail.unitPrice,
            };
            setOrderDetails([...orderDetails, newDetail]);
            setNewOrderDetail({ productId: '', quantity: 1, unitPrice: undefined });
            setSearchTermProduct('');
        } else {
            alert('Por favor, selecciona un producto e ingresa una cantidad válida.');
        }
    };

    // Función para eliminar un producto del detalle
    const handleDeleteOrderDetail = (index) => {
        const updatedDetails = orderDetails.filter((_, i) => i !== index);
        setOrderDetails(updatedDetails);
    };

    useEffect(() => {
        handleSearchCustomer();
      }, [debouncedTerm]);
    

    // Efecto para calcular el total y el impuesto cada vez que cambian los detalles del pedido
    useEffect(() => {
        let subtotalSum = orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
        let taxRate = 0;
        // Simulación de la tasa de impuesto según la ubicación (deberías obtener esto del backend si es dinámico)
        /*if (true ) {
            taxRate = 0.18; 
        } else if (false ) {
            taxRate = 0.12;
        }*/
        taxRate = 0.12;
        const calculatedTax = subtotalSum * taxRate;
        const total = subtotalSum + calculatedTax;

        setTotalAmount(total.toFixed(2));
        setTaxAmount(calculatedTax.toFixed(2));
    }, [orderDetails]);

    // Función para guardar el pedido
    const handleSaveOrder = async () => {
        if (!selectedCustomer) {
            alert('Por favor, selecciona un cliente.');
            return;
        }
        if (!orderDate) {
            alert('Por favor, selecciona la fecha del pedido.');
            return;
        }
        if (orderDetails.length === 0) {
            alert('Por favor, agrega al menos un producto al pedido.');
            return;
        }

        const orderData = {
            customerId: selectedCustomer.id, // Si el backend también espera esto en la raíz
            orderDate: orderDate,
            subtotal: parseFloat(orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0).toFixed(2)),
            iva: parseFloat(taxAmount),
            total: parseFloat(totalAmount),
            orderDetails: orderDetails.map(detail => ({
                productId: detail.productId,
                quantity: detail.quantity,
            })),
            
        };

        console.log('Datos a enviar al backend:', orderData);

        try {
            const response = await axios.post('https://localhost:7193/api/Orders/CreateSimple', orderData, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Si es necesario
                    'Content-Type': 'application/json',
                },
            });
            console.log('Pedido creado exitosamente:', response.data);
            // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
            // También deberías iniciar la descarga del PDF de la factura
            generateInvoicePDF(
                { ...orderData, id: response.data.id, orderDetails: orderDetails }, // Incluye el ID de la orden y los detalles completos
                selectedCustomer
            );
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
            alert('Error al guardar el pedido.');
        }
    };


    const handleResetForm = () => {
        setSearchTermCustomer('');
        setSearchResultsCustomers([]);
        setSelectedCustomer(null);
        setOrderDate('');
        setOrderDetails([]);
        setSearchTermProduct('');
        setSearchResultsProducts([]);
        setNewOrderDetail({ productId: '', quantity: 1 });
        setTotalAmount(0);
        setTaxAmount(0);
        setTerm(''); // Reset del término del debounce
    };


    const handleGoBack = () => {
        navigate(-1); // Navega a la página anterior en el historial
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Pedido</h2>

            {/* Sección para seleccionar el cliente */}
            <div className="mb-4">
                <label htmlFor="searchCustomer" className="block text-white-700 text-sm font-bold mb-2">
                    Buscar Cliente (RUC/Nombre):
                </label>
                <input
                    type="text"
                    id="searchCustomer"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={searchTermCustomer}
                    onChange={(e) => setTerm(e.target.value)}
                />
                {loadingCustomers && <p className="text-white-500 text-sm mt-1">Cargando clientes...</p>}
                {errorCustomers && <p className="text-red-500 text-sm mt-1">{errorCustomers}</p>}
                {searchResultsCustomers.length > 0 && (
                    <ul className="bg-green-800 shadow-md rounded mt-1 max-h-48 overflow-y-auto z-10 relative">
                        {searchResultsCustomers.map(customer => (
                            <li
                                key={customer.id}
                                onClick={() => handleSelectCustomer(customer)}
                                className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                            >
                                {customer.name} ({customer.ruc})
                            </li>
                        ))}
                    </ul>
                )}
                {selectedCustomer && <p className="text-green-500 text-sm mt-2">Cliente seleccionado: {selectedCustomer.name} ({selectedCustomer.ruc})</p>}
            </div>

            {/* Sección para la fecha del pedido */}
            <div className="mb-4">
                <label htmlFor="orderDate" className="block text-white-700 text-sm font-bold mb-2">
                    Fecha del Pedido:
                </label>
                <input
                    type="date"
                    id="orderDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={orderDate}
                    onChange={handleOrderDateChange}
                />
            </div>


            {/* Sección para agregar detalles del pedido */}
            <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Detalle del Pedido</h3>
                <div className="mb-2">
                    <label htmlFor="searchProduct" className="block text-white-700 text-sm font-bold mb-2">
                        Buscar Producto:
                    </label>
                    <input
                        type="text"
                        id="searchProduct"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={searchTermProduct}
                        onChange={(e) => handleSearchProduct(e.target.value)}
                    />
                    {loadingProducts && <p className="text-white-500 text-sm mt-1">Cargando productos...</p>}
                    {errorProducts && <p className="text-red-500 text-sm mt-1">{errorProducts}</p>}
                    {searchResultsProducts.length > 0 && (
                        <ul className="bg-green shadow-md rounded mt-1 max-h-48 overflow-y-auto z-10 relative">
                            {searchResultsProducts.map(product => (
                                <li
                                    key={product.id}
                                    onClick={() => handleSelectProduct(product)}
                                    className="px-4 py-2 hover:bg-green-800 cursor-pointer"
                                >
                                    {product.name} - ${product.price} - {product.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {newOrderDetail.productId && (
                    <div className="flex items-center space-x-4 mb-2">
                        <div>
                            <label htmlFor="quantity" className="block text-white-700 text-sm font-bold mb-2">
                                Cantidad:
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                className="shadow appearance-none border rounded w-24 py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline "
                                value={newOrderDetail.quantity}
                                onChange={handleQuantityChange}
                                min="1"
                            />
                        </div>
                        <button
                            onClick={handleAddOrderDetail}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Agregar Producto
                        </button>
                    </div>
                )}

                {orderDetails.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full shadow-md rounded">
                            <thead className="bg-green-400">
                                <tr>
                                    <th className="px-4 py-2">Producto</th>
                                    <th className="px-4 py-2">Cantidad</th>
                                    <th className="px-4 py-2">Precio Unitario</th>
                                    <th className="px-4 py-2">Subtotal</th>
                                    <th className="px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.map((detail, index) => (
                                    <tr key={index} className="hover:bg-green-900">
                                        <td className="border px-4 py-2">{detail.productName}</td>
                                        <td className="border px-4 py-2">{detail.quantity}</td>
                                        <td className="border px-4 py-2">${detail.unitPrice.toFixed(2)}</td>
                                        <td className="border px-4 py-2">${detail.subtotal.toFixed(2)}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => handleDeleteOrderDetail(index)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Sección para mostrar el total y el impuesto */}
            <div className="mt-4 p-4 bg-gray-700 rounded shadow-md">
                <p className="text-lg"><span className="font-semibold">Subtotal:</span> ${orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0).toFixed(2)}</p>
                <p className="text-lg"><span className="font-semibold">Impuesto (12%):</span> ${taxAmount}</p>
                <p className="text-xl font-semibold"><span className="font-bold">Total a Pagar:</span> ${totalAmount}</p>
            </div>

            {/* Botón para guardar el pedido */}
            <button
                onClick={handleSaveOrder}
                disabled={loadingCustomers || loadingProducts || !selectedCustomer || orderDetails.length === 0 || !orderDate}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ${loadingCustomers || loadingProducts || !selectedCustomer || orderDetails.length === 0 || !orderDate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Guardar Pedido
            </button>

            <button
                    onClick={handleResetForm}
                    className="bg-blue-300 hover:bg-blue-400 text-white-800 font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline"
                >
                    Resetear
                </button>
                <button
                    onClick={handleGoBack}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Regresar
                </button>
        </div>
    );
};

export default CreateOrderForm;