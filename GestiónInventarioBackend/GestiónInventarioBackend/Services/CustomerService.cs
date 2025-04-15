using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GestiónInventarioBackend.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context; 
        private readonly IMemoryCache _memoryCache;
        private const string CustomerSearchCacheKey = "CustomerSearch_";
        private readonly TimeSpan _cacheExpirationTime = TimeSpan.FromMinutes(5); // Tiempo de expiración de la caché

        public CustomerService(AppDbContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _memoryCache = memoryCache;
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> GetCustomerByIdAsync(int id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task<Customer> GetCustomerByRucAsync(string ruc)
        {
            return await _context.Customers.FirstOrDefaultAsync(c => c.Ruc == ruc);
        }

        public async Task<IEnumerable<Customer>> SearchCustomersAsync(string searchTerm)
        {
            return await _context.Customers
                .Where(c => c.Ruc.Contains(searchTerm) || c.Name.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<bool> CreateCustomerAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> UpdateCustomerAsync(Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
            try
            {
                var result = await _context.SaveChangesAsync();
                return result > 0;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CustomerExistsAsync(customer.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return false;
            }
            _context.Customers.Remove(customer);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> CustomerExistsAsync(int id)
        {
            return await _context.Customers.AnyAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Customer>> SearchCustomersWithCacheAsync(string searchTerm)
        {
            string cacheKey = CustomerSearchCacheKey + searchTerm;

            if (_memoryCache.TryGetValue(cacheKey, out IEnumerable<Customer> cachedCustomers))
            {
                return cachedCustomers;
            }

            // Si no está en la caché, busca en la base de datos
            var customers = await _context.Customers
                .Where(c => c.Ruc.Contains(searchTerm) || c.Name.Contains(searchTerm))
                .ToListAsync();

            // Guarda el resultado en la caché
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(_cacheExpirationTime)
                .SetSlidingExpiration(TimeSpan.FromMinutes(2)); 

            _memoryCache.Set(cacheKey, customers, cacheEntryOptions);

            return customers;
        }
    }
}
