using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace GestiónInventarioBackend.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders.Include(o => o.OrderDetails).ToListAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _context.Orders.Include(o => o.OrderDetails).ThenInclude(od => od.Product).FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            if (order.OrderDate > DateTime.Now.Date)
            {
                throw new ArgumentException("La fecha del pedido no puede ser futura.");
            }

            // Validar que el CustomerId existe en la base de datos de Customers
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == order.CustomerId);
            if (!customerExists)
            {
                throw new ArgumentException($"El ID del cliente '{order.CustomerId}' no existe.");
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<Order?> UpdateOrderAsync(int id, Order order)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
            {
                return null;
            }

            if (order.OrderDate > DateTime.Now.Date)
            {
                throw new ArgumentException("La fecha del pedido no puede ser futura.");
            }

            // Validar que el CustomerId existe en la base de datos de Customers
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == order.CustomerId);
            if (!customerExists)
            {
                throw new ArgumentException($"El ID del cliente '{order.CustomerId}' no existe.");
            }

            existingOrder.CustomerId = order.CustomerId;
            existingOrder.OrderDate = order.OrderDate;
            // No permitimos actualizar Subtotal, IVA y Total directamente, se recalculan.

            await _context.SaveChangesAsync();
            return existingOrder;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var orderToDelete = await _context.Orders.FindAsync(id);
            if (orderToDelete == null)
            {
                return false;
            }

            _context.Orders.Remove(orderToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Order>> SearchOrdersByCustomer(string searchTerm)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.Customer.Ruc.Contains(searchTerm) || o.Customer.Name.ToLower().Contains(searchTerm.ToLower()))
                .ToListAsync();
        }
    }
}
