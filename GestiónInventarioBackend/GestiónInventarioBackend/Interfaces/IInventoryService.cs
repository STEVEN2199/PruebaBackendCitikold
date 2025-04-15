using GestiónInventarioBackend.Models;

namespace GestiónInventarioBackend.Interfaces
{
    public interface IInventoryService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product?> UpdateProductAsync(int id, Product product);
        Task<bool> DeleteProductAsync(int id);

        Task<decimal> CalculateTotalInventoryValueAsync();
        Task<decimal> CalculateAverageProductPriceAsync();
        Task<string> GenerateInventoryReportAsync(); // Por ahora, devuelve un string
    }
}