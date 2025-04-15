using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace GestiónInventarioBackend.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly AppDbContext _context;

        public InventoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateProductAsync(int id, Product product)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;

            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var productToDelete = await _context.Products.FindAsync(id);
            if (productToDelete == null)
            {
                return false;
            }

            _context.Products.Remove(productToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> CalculateTotalInventoryValueAsync()
        {
            decimal totalValue = await _context.Products
                .SumAsync(p => p.Price * p.StockQuantity);

            // Validación básica (aunque SumAsync generalmente no devuelve negativo)
            return Math.Max(0, totalValue);
        }

        public async Task<decimal> CalculateAverageProductPriceAsync()
        {
            if (!await _context.Products.AnyAsync())
            {
                return 0; // Evitar división por cero
            }

            decimal averagePrice = await _context.Products.AverageAsync(p => p.Price);
            return averagePrice;
        }

        public async Task<string> GenerateInventoryReportAsync()
        {
            var products = await _context.Products.ToListAsync();
            if (!products.Any())
            {
                return "El inventario está vacío.";
            }

            var report = "--- Reporte de Inventario ---\n\n";
            foreach (var product in products)
            {
                report += $"ID: {product.Id}\n";
                report += $"Nombre: {product.Name}\n";
                report += $"Descripción: {product.Description ?? "N/A"}\n";
                report += $"Precio: {product.Price:C}\n";
                report += $"Cantidad en Stock: {product.StockQuantity}\n";
                report += $"Valor Total: {(product.Price * product.StockQuantity):C}\n";
                report += "---\n";
            }

            decimal totalValue = await CalculateTotalInventoryValueAsync();
            decimal averagePrice = await CalculateAverageProductPriceAsync();

            report += $"\nValor Total del Inventario: {totalValue:C}\n";
            report += $"Precio Promedio de los Productos: {averagePrice:C}\n";

            return report;
        }
    }
}