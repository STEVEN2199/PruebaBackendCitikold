using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Dtos;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace GestiónInventarioBackend.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IProductService _productService;

        private const decimal IVARate = 0.12m;

        public OrderService(AppDbContext context, IProductService productService)
        {
            _context = context;
            _productService = productService;
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

            if (order.OrderDetails != null && order.OrderDetails.Any())
            {
                foreach (var orderDetail in order.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(orderDetail.ProductId);
                    if (product == null)
                    {
                        throw new ArgumentException($"El producto con ID '{orderDetail.ProductId}' no existe.");
                    }

                    if (orderDetail.Quantity <= 0)
                    {
                        throw new ArgumentException("La cantidad debe ser mayor a cero.");
                    }

                    orderDetail.OrderId = order.Id; // Asigna el OrderId
                    orderDetail.UnitPrice = product.Price;
                    orderDetail.Subtotal = orderDetail.Quantity * orderDetail.UnitPrice;

                    _context.OrderDetails.Add(orderDetail);
                    product.StockQuantity -= orderDetail.Quantity; // Considera mover esto a un servicio dedicado
                    _context.Entry(product).State = EntityState.Modified;
                }
            }

            // Recalcular Subtotal, Iva y Total de la orden
            order.Subtotal = order.OrderDetails.Sum(od => od.Subtotal);
            order.Iva = order.Subtotal * 0.12m; // Usar la tasa de IVA (podrías tenerla configurable)
            order.Total = order.Subtotal + order.Iva;

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


        public async Task<Order> CreateOrderSimpleAsync(CreateOrderDto createOrderDto)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == createOrderDto.CustomerId);
            if (!customerExists)
            {
                throw new ArgumentException($"El ID del cliente '{createOrderDto.CustomerId}' no existe.");
            }

            if (createOrderDto.OrderDate > DateTime.Now.Date)
            {
                throw new ArgumentException("La fecha del pedido no puede ser futura.");
            }

            var order = new Order
            {
                CustomerId = createOrderDto.CustomerId,
                OrderDate = createOrderDto.OrderDate,
                OrderDetails = new List<OrderDetail>()
            };

            decimal orderSubtotal = 0;

            foreach (var detailDto in createOrderDto.OrderDetails)
            {
                var product = await _productService.GetProductByIdAsync(detailDto.ProductId);
                if (product == null)
                {
                    throw new ArgumentException($"El producto con ID '{detailDto.ProductId}' no existe.");
                }

                if (detailDto.Quantity <= 0)
                {
                    throw new ArgumentException($"La cantidad para el producto '{detailDto.ProductId}' debe ser mayor a cero.");
                }

                var orderDetail = new OrderDetail
                {
                    ProductId = detailDto.ProductId,
                    Quantity = detailDto.Quantity,
                    UnitPrice = product.Price,
                    Subtotal = detailDto.Quantity * product.Price,
                    Order = order // Establecer la relación
                };

                order.OrderDetails.Add(orderDetail);
                orderSubtotal += orderDetail.Subtotal;

                // Aquí podrías también actualizar el stock si lo deseas,
                // o hacerlo en otro servicio/método.
                // product.StockQuantity -= detailDto.Quantity;
                // _context.Entry(product).State = EntityState.Modified;
            }

            order.Subtotal = orderSubtotal;
            order.Iva = orderSubtotal * IVARate;
            order.Total = orderSubtotal + order.Iva;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order;
        }

    }
}
