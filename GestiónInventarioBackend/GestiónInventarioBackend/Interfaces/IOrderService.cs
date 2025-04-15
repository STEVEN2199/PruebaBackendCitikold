using GestiónInventarioBackend.Dtos;
using GestiónInventarioBackend.Models;

namespace GestiónInventarioBackend.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int id);
        Task<Order> CreateOrderAsync(Order order);
        Task<Order?> UpdateOrderAsync(int id, Order order);
        Task<bool> DeleteOrderAsync(int id);

        Task<IEnumerable<Order>> SearchOrdersByCustomer(string searchTerm); // Búsqueda por RUC o Nombre

        Task<Order> CreateOrderSimpleAsync(CreateOrderDto createOrderDto);
    }
}
