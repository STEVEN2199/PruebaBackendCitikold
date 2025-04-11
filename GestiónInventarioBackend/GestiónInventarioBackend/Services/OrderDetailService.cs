using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace GestiónInventarioBackend.Services
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly AppDbContext _context;
        private readonly IInventoryService _inventoryService; // Para validar stock

        // Tasa de IVA en Ecuador (ejemplo: 12%)
        private const decimal IVARate = 0.12m;

        public OrderDetailService(AppDbContext context, IInventoryService inventoryService)
        {
            _context = context;
            _inventoryService = inventoryService;
        }

        public async Task<OrderDetail> AddOrderDetailAsync(OrderDetail orderDetail)
        {
            var product = await _inventoryService.GetProductByIdAsync(orderDetail.ProductId);
            if (product == null)
            {
                throw new ArgumentException("El ID del producto no existe.");
            }

            if (orderDetail.Quantity <= 0)
            {
                throw new ArgumentException("La cantidad debe ser mayor a cero.");
            }

            if (orderDetail.Quantity > product.StockQuantity)
            {
                throw new ArgumentException("La cantidad excede el stock disponible.");
            }

            orderDetail.UnitPrice = product.Price;
            orderDetail.Subtotal = orderDetail.Quantity * orderDetail.UnitPrice;

            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            // Actualizar el stock del producto
            product.StockQuantity -= orderDetail.Quantity;
            await _inventoryService.UpdateProductAsync(product.Id, product);

            // Recalcular el total del pedido
            await RecalculateOrderTotal(orderDetail.OrderId);

            return orderDetail;
        }

        public async Task<OrderDetail?> GetOrderDetailByIdAsync(int id)
        {
            return await _context.OrderDetails.FindAsync(id);
        }

        public async Task<OrderDetail?> UpdateOrderDetailAsync(int id, OrderDetail orderDetail)
        {
            var existingOrderDetail = await _context.OrderDetails.FindAsync(id);
            if (existingOrderDetail == null)
            {
                return null;
            }

            var originalQuantity = existingOrderDetail.Quantity;

            var product = await _inventoryService.GetProductByIdAsync(orderDetail.ProductId);
            if (product == null)
            {
                throw new ArgumentException("El ID del producto no existe.");
            }

            if (orderDetail.Quantity <= 0)
            {
                throw new ArgumentException("La cantidad debe ser mayor a cero.");
            }

            // Validar stock al actualizar (considerando la cantidad original)
            if (orderDetail.Quantity - originalQuantity > product.StockQuantity)
            {
                throw new ArgumentException("La nueva cantidad excede el stock disponible.");
            }

            existingOrderDetail.ProductId = orderDetail.ProductId;
            existingOrderDetail.Quantity = orderDetail.Quantity;
            existingOrderDetail.UnitPrice = product.Price; // Mantener el precio actual del producto
            existingOrderDetail.Subtotal = existingOrderDetail.Quantity * existingOrderDetail.UnitPrice;

            await _context.SaveChangesAsync();

            // Actualizar el stock del producto (restando la diferencia)
            product.StockQuantity -= (orderDetail.Quantity - originalQuantity);
            await _inventoryService.UpdateProductAsync(product.Id, product);

            // Recalcular el total del pedido
            await RecalculateOrderTotal(orderDetail.OrderId);

            return existingOrderDetail;
        }

        public async Task<bool> DeleteOrderDetailAsync(int id)
        {
            var orderDetailToDelete = await _context.OrderDetails.FindAsync(id);
            if (orderDetailToDelete == null)
            {
                return false;
            }

            var product = await _inventoryService.GetProductByIdAsync(orderDetailToDelete.ProductId);
            if (product != null)
            {
                // Devolver la cantidad al stock
                product.StockQuantity += orderDetailToDelete.Quantity;
                await _inventoryService.UpdateProductAsync(product.Id, product);
            }

            _context.OrderDetails.Remove(orderDetailToDelete);
            await _context.SaveChangesAsync();

            // Recalcular el total del pedido
            await RecalculateOrderTotal(orderDetailToDelete.OrderId);

            return true;
        }

        private async Task RecalculateOrderTotal(int orderId)
        {
            var order = await _context.Orders.Include(o => o.OrderDetails).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order != null)
            {
                order.Subtotal = order.OrderDetails.Sum(od => od.Subtotal);
                order.Iva = order.Subtotal * IVARate;
                order.Total = order.Subtotal + order.Iva;
                await _context.SaveChangesAsync();
            }
        }
    }
}
