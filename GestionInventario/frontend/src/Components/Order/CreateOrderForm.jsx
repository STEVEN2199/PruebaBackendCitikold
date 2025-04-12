import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext'; // Si necesitas autenticación

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

    const { authToken } = useAuth(); // Si necesitas el token

    // Función para buscar clientes
    const handleSearchCustomer = async (term) => {
        setSearchTermCustomer(term);
        if (term.length >= 3) { // Iniciar la búsqueda con al menos 3 caracteres
            setLoadingCustomers(true);
            setErrorCustomers('');
            try {
                const response = await axios.get(`https://localhost:7193/api/Customers/search?searchTerm=${term}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Si es necesario
                    },
                });
                console.log('Respuesta de búsqueda de clientes:', response.data);
                //setSearchResultsCustomers([{ id: 999, Nombre: 'PRUEBA', Ruc: '1234567890' }]);
                setSearchResultsCustomers(response.data);
            } catch (error) {
                setErrorCustomers('Error al buscar clientes.');
                console.error('Error al buscar clientes:', error);
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
            customerId: selectedCustomer.id,
            customer: selectedCustomer,
            orderDate: orderDate,
            orderDetails: orderDetails.map(detail => ({
                productId: detail.productId,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                subtotal: detail.quantity * detail.unitPrice,
                order: null, // Si el backend realmente necesita esta propiedad
            })),
            subtotal: parseFloat(orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0).toFixed(2)),
            iva: parseFloat(taxAmount),
            total: parseFloat(totalAmount),
        };

        console.log('Datos a enviar al backend:', orderData);

        try {
            const response = await axios.post('https://localhost:7193/api/Orders', orderData, {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Si es necesario
                    'Content-Type': 'application/json',
                },
            });
            console.log('Pedido creado exitosamente:', response.data);
            // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
            // También deberías iniciar la descarga del PDF de la factura
        } catch (error) {
            console.error('Error al guardar el pedido:', error);
            alert('Error al guardar el pedido.');
        }
    };

    return (
        <div>
            <h2>Crear Nuevo Pedido</h2>

            {/* Sección para seleccionar el cliente */}
            <div>
                <label htmlFor="searchCustomer">Buscar Cliente (RUC/Nombre):</label>
                <input
                    type="text"
                    id="searchCustomer"
                    value={searchTermCustomer}
                    onChange={(e) => handleSearchCustomer(e.target.value)}
                />
                {loadingCustomers && <p>Cargando clientes...</p>}
                {errorCustomers && <p style={{ color: 'red' }}>{errorCustomers}</p>}
                {searchResultsCustomers.length > 0 && (
                    <ul >
                        {searchResultsCustomers.map(customer => {
                            console.log('Renderizando cliente:', customer);
                            return (
                                <li key={customer.id} onClick={() => handleSelectCustomer(customer)} style={{ cursor: 'pointer' }}>
                                    {customer.name} ({customer.ruc})
                                </li>
                            );
                        })}
                    </ul>
                )}
                {selectedCustomer && <p>Cliente seleccionado: {selectedCustomer.name} ({selectedCustomer.ruc})</p>}
            </div>

            {/* Sección para la fecha del pedido */}
            <div>
                <label htmlFor="orderDate">Fecha del Pedido:</label>
                <input
                    type="date"
                    id="orderDate"
                    value={orderDate}
                    onChange={handleOrderDateChange}
                />
            </div>

            {/* Sección para agregar detalles del pedido */}
            <div>
                <h3>Detalle del Pedido</h3>
                <div>
                    <label htmlFor="searchProduct">Buscar Producto:</label>
                    <input
                        type="text"
                        id="searchProduct"
                        value={searchTermProduct}
                        onChange={(e) => handleSearchProduct(e.target.value)}
                    />
                    {loadingProducts && <p>Cargando productos...</p>}
                    {errorProducts && <p style={{ color: 'red' }}>{errorProducts}</p>}
                    {searchResultsProducts.length > 0 && (
                        <ul>
                            {searchResultsProducts.map(product => (
                                <li key={product.id} onClick={() => handleSelectProduct(product)} style={{ cursor: 'pointer' }}>
                                    {product.name} - ${product.price}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {newOrderDetail.productId && (
                    <div>
                        <label htmlFor="quantity">Cantidad:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={newOrderDetail.quantity}
                            onChange={handleQuantityChange}
                            min="1"
                        />
                        <button onClick={handleAddOrderDetail}>Agregar Producto</button>
                    </div>
                )}

                {orderDetails.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail.productName}</td>
                                    <td>{detail.quantity}</td>
                                    <td>${detail.unitPrice.toFixed(2)}</td>
                                    <td>${detail.subtotal.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleDeleteOrderDetail(index)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Sección para mostrar el total y el impuesto */}
            <div>
                <p>Subtotal: ${orderDetails.reduce((sum, detail) => sum + detail.subtotal, 0).toFixed(2)}</p>
                <p>{/* Mostrar IGV o IVA según la lógica */}Impuesto: ${taxAmount}</p>
                <p>Total a Pagar: ${totalAmount}</p>
            </div>

            {/* Botón para guardar el pedido */}
            <button onClick={handleSaveOrder} disabled={loadingCustomers || loadingProducts}>Guardar Pedido</button>
        </div>
    );
};

export default CreateOrderForm;