using GestiónInventarioBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GestiónInventarioBackend.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> AddProductAsync(Product product);
        Task<bool> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(int id);

        Task<(IEnumerable<Product>, int)> GetPaginatedProductsAsync(int pageNumber, int pageSize, string? sortBy, string? sortDirection);
        Task<IEnumerable<Product>> SearchProductsWithCacheAsync(string searchTerm);
    }
}
