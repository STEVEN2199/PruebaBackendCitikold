using GestiónInventarioBackend.Models;

namespace GestiónInventarioBackend.Interfaces
{
    public interface IOrderDetailService
    {
        Task<OrderDetail> AddOrderDetailAsync(OrderDetail orderDetail);
        Task<OrderDetail?> GetOrderDetailByIdAsync(int id);
        Task<OrderDetail?> UpdateOrderDetailAsync(int id, OrderDetail orderDetail);
        Task<bool> DeleteOrderDetailAsync(int id);
    }
}
