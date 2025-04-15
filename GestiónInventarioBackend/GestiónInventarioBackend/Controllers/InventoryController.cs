using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestiónInventarioBackend.Controllers
{
    [Authorize] // Asegura que solo usuarios autenticados puedan acceder
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _inventoryService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _inventoryService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var createdProduct = await _inventoryService.CreateProductAsync(product);
            return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedProduct = await _inventoryService.UpdateProductAsync(id, product);
            if (updatedProduct == null)
            {
                return NotFound();
            }
            return Ok(updatedProduct);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var deleted = await _inventoryService.DeleteProductAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("total-value")]
        public async Task<IActionResult> GetTotalInventoryValue()
        {
            var totalValue = await _inventoryService.CalculateTotalInventoryValueAsync();
            return Ok(new { totalValue });
        }

        [HttpGet("average-price")]
        public async Task<IActionResult> GetAverageProductPrice()
        {
            var averagePrice = await _inventoryService.CalculateAverageProductPriceAsync();
            return Ok(new { averagePrice });
        }

        [HttpGet("report")]
        public async Task<IActionResult> GetInventoryReport()
        {
            var report = await _inventoryService.GenerateInventoryReportAsync();
            return Ok(new { report });
        }
    }
}