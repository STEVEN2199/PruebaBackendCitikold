using GestiónInventarioBackend.Models;

namespace GestiónInventarioBackend.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllCustomersAsync();
        Task<Customer> GetCustomerByIdAsync(int id);
        Task<Customer> GetCustomerByRucAsync(string ruc);
        Task<IEnumerable<Customer>> SearchCustomersAsync(string searchTerm);
        Task<bool> CreateCustomerAsync(Customer customer);
        Task<bool> UpdateCustomerAsync(Customer customer);
        Task<bool> DeleteCustomerAsync(int id);
        Task<bool> CustomerExistsAsync(int id);
    }
}
