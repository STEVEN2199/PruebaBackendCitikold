import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '../assets/citikold.png';
//import generateInvoicePDF from '../../Pdf/generateInvoicePDF';

const generateInvoicePDF = (orderData, customer) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const textColor = '#000';
    const primaryColor = '#7dcea0'; // Un rosa similar al de tu imagen
    const margin = 15;

    // Agregar imagen
    const logoWidth = 40; // Ancho deseado del logo
    const logoHeight = (logoWidth / (4/ 1));    //Calcula la altura manteniendo la proporción
    doc.addImage(logoImage, 'PNG', margin, margin, logoWidth, logoHeight);

    // Logo (simulado)
    doc.setFontSize(20);
    doc.setTextColor(primaryColor);
    //doc.text('LOGO', margin, margin + 10);

    // Invoice Title
    doc.setFontSize(26);
    doc.setTextColor(textColor);
    doc.text('Factura', pageWidth - margin - doc.getTextWidth('Invoice'), margin + 10);

    // Invoice Info
    doc.setFontSize(12);
    doc.setTextColor('#777');
    doc.text(`Invoice no.: ${orderData.id || 'Pendiente'}`, pageWidth - margin - doc.getTextWidth(`Invoice no.: ${orderData.id || 'Pendiente'}`), margin + 20);
    doc.text(`Invoice date: ${new Date(orderData.orderDate).toLocaleDateString()}`, pageWidth - margin - doc.getTextWidth(`Invoice date: ${new Date(orderData.orderDate).toLocaleDateString()}`), margin + 26);
    doc.text(`Due: ${new Date(orderData.orderDate).toLocaleDateString()}`, pageWidth - margin - doc.getTextWidth(`Due: ${new Date(orderData.orderDate).toLocaleDateString()}`), margin + 32);

    // From Section
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text('From', margin, 50);
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text('CITIKOLD S.A.', margin, 60);
    doc.text('CITIKOLD S.A.', margin, 66);
    doc.text('xgame@citikold.com', margin, 72);
    doc.text('04-3731590', margin, 78);
    doc.text('https://citikold.com/', margin, 84);
    doc.text('Puerto Santa Ana, Edificio The Point Piso', margin, 90);

    // Bill To Section
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text('Bill to', pageWidth / 2, 50);
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text(customer.name, pageWidth / 2, 60);
    doc.text(customer.email || '[E-MAIL]', pageWidth / 2, 66);
    doc.text(customer.cellphoneNumber || '[PHONE]', pageWidth / 2, 72);
    doc.text(customer.address || '[ADDRESS]', pageWidth / 2, 78);

    // Order Details Table
    autoTable(doc, {
        columns: [
            { header: 'Description', dataKey: 'productName' },
            { header: 'Rate, USD', dataKey: 'unitPrice' },
            { header: 'Qty', dataKey: 'quantity' },
            { header: 'Tax, %', dataKey: 'taxRate' },
            { header: 'Disc, %', dataKey: 'discountRate' },
            { header: 'Amount, USD', dataKey: 'subtotal' },
        ],
        body: orderData.orderDetails.map(item => ({
            ...item,
            unitPrice: parseFloat(item.unitPrice).toFixed(2),
            subtotal: parseFloat(item.subtotal).toFixed(2),
            taxRate: '12.00', // Asegúrate de tener la lógica real de impuestos
            discountRate: '0.00', // Asegúrate de tener la lógica real de descuentos
        })),
        startY: 110,
        margin: { left: margin, right: margin },
        styles: {
            fontSize: 10,
            textColor: '#333',
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: '#fff',
            fontSize: 12,
        },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Payment Instruction (simulado)
    doc.setFontSize(12);
    doc.setTextColor('#777');
    doc.text('Payment instruction', margin, finalY + 10);
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text('AGREGAR FORMA DE PAGO', margin, finalY + 20);
    doc.text('PAGO EFECTIVO', margin, finalY + 26);

    // Totals
    const startXTotals = pageWidth - 100 - margin;
    let currentY = finalY + 10;
    const lineHeight = 6;
    doc.setFontSize(12);
    doc.setTextColor('#333');
    doc.text(`Subtotal, USD:`, startXTotals, currentY);
    doc.text(`${parseFloat(orderData.subtotal).toFixed(2)}`, pageWidth - margin - doc.getTextWidth(`${parseFloat(orderData.subtotal).toFixed(2)}`), currentY);
    currentY += lineHeight;
    doc.text(`Discount, USD:`, startXTotals, currentY);
    doc.text(`0.00`, pageWidth - margin - doc.getTextWidth(`0.00`), currentY); // Reemplaza con el descuento real
    currentY += lineHeight;
    doc.text(`Shipping Cost, USD:`, startXTotals, currentY);
    doc.text(`0.00`, pageWidth - margin - doc.getTextWidth(`0.00`), currentY); // Reemplaza con el costo de envío real
    currentY += lineHeight;
    doc.text(`Sales Tax, USD:`, startXTotals, currentY);
    doc.text(`${parseFloat(orderData.iva).toFixed(2)}`, pageWidth - margin - doc.getTextWidth(`${parseFloat(orderData.iva).toFixed(2)}`), currentY);
    currentY += lineHeight + 2;
    doc.setFontSize(14);
    doc.setTextColor(textColor);
    doc.text(`Total, USD:`, startXTotals, currentY);
    doc.text(`${parseFloat(orderData.total).toFixed(2)}`, pageWidth - margin - doc.getTextWidth(`${parseFloat(orderData.total).toFixed(2)}`), currentY);
    currentY += lineHeight + 4;
    doc.setFontSize(12);
    doc.setTextColor('#777');
    doc.text(`Amount paid, USD:`, startXTotals, currentY);
    doc.text(`0.00`, pageWidth - margin - doc.getTextWidth(`0.00`), currentY); // Reemplaza con el monto pagado real
    currentY += lineHeight + 2;
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text(`Balance Due, USD:`, startXTotals, currentY);
    doc.text(`${parseFloat(orderData.total).toFixed(2)}`, pageWidth - margin - doc.getTextWidth(`${parseFloat(orderData.total).toFixed(2)}`), currentY); // Reemplaza con el saldo real

    // Save the PDF
    doc.save(`invoice-${orderData.id || new Date().getTime()}.pdf`);
};

export default generateInvoicePDF;