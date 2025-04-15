using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestiónInventarioBackend.Controllers
{

    [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost("CreateProduct")]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productService.AddProductAsync(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _productService.UpdateProductAsync(product))
            {
                return NotFound(); 
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var result = await _productService.DeleteProductAsync(id);
            if (!result)
            {
                return StatusCode(500, "Ocurrió un error al eliminar el producto.");
            }

            return NoContent();
        }


        [HttpGet("paginated")]
        public async Task<ActionResult<(IEnumerable<Product>, int)>> GetPaginatedProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDirection = null)
        {
            var (products, totalCount) = await _productService.GetPaginatedProductsAsync(pageNumber, pageSize, sortBy, sortDirection);
            return Ok(new { products, totalCount });
        }

        [HttpGet("search-cached")]
        public async Task<ActionResult<IEnumerable<Product>>> SearchProductsCached(string name) 
        {
            var products = await _productService.SearchProductsWithCacheAsync(name);
            return Ok(products);
        }
    }
}
