using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;


namespace GestiónInventarioBackend.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _memoryCache;
        private const string ProductSearchCacheKey = "ProductSearch_";
        private readonly TimeSpan _cacheExpirationTime = TimeSpan.FromMinutes(5);

        public ProductService(AppDbContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _memoryCache = memoryCache;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateProductAsync(Product product)
        {
            var existingProduct = await _context.Products.FindAsync(product.Id);
            if (existingProduct == null)
            {
                return false; // O lanzar una excepción indicando que el producto no existe
            }

            // Actualizar las propiedades de la entidad existente con los valores del 'product' que viene del frontend
            _context.Entry(existingProduct).CurrentValues.SetValues(product);

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Log del error
                Console.WriteLine($"Error al actualizar el producto: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<(IEnumerable<Product>, int)> GetPaginatedProductsAsync(int pageNumber, int pageSize, string? sortBy, string? sortDirection)
        {
            var query = _context.Products.AsQueryable();

            // Ordenamiento
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.ToLower() == "name")
                {
                    query = sortDirection?.ToLower() == "desc" ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name);
                }
                else if (sortBy.ToLower() == "price")
                {
                    query = sortDirection?.ToLower() == "desc" ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price);
                }
                else if (sortBy.ToLower() == "stockquantity")
                {
                    query = sortDirection?.ToLower() == "desc" ? query.OrderByDescending(p => p.StockQuantity) : query.OrderBy(p => p.StockQuantity);
                }
                // Puedes agregar más criterios de ordenamiento aquí
            }
            else
            {
                query = query.OrderBy(p => p.Id); // Ordenamiento por defecto
            }

            // Paginación
            var totalCount = await query.CountAsync();
            var products = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (products, totalCount);
        }


        public async Task<IEnumerable<Product>> SearchProductsWithCacheAsync(string searchTerm)
        {
            string cacheKey = ProductSearchCacheKey + searchTerm;

            if (_memoryCache.TryGetValue(cacheKey, out IEnumerable<Product> cachedProducts))
            {
                return cachedProducts;
            }

            // Si no está en la caché, busca en la base de datos
            var products = await _context.Products
                .Where(p => p.Name.Contains(searchTerm)) // Basado en el parámetro 'name' del frontend
                .ToListAsync();

            // Guarda el resultado en la caché
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(_cacheExpirationTime)
                .SetSlidingExpiration(TimeSpan.FromMinutes(2)); // Opcional: extiende la expiración si se accede

            _memoryCache.Set(cacheKey, products, cacheEntryOptions);

            return products;
        }

    }
}
