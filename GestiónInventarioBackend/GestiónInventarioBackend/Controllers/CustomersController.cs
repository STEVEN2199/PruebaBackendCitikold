using GestiónInventarioBackend.Models;
using GestiónInventarioBackend.Services;
using Microsoft.AspNetCore.Mvc;
using GestiónInventarioBackend.Interfaces;
using GestiónInventarioBackend.Dtos;
using GestiónInventarioBackend.Context;
using GestiónInventarioBackend.Mappers;

namespace GestiónInventarioBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly AppDbContext _context;

        public CustomersController(ICustomerService customerService, AppDbContext context)
        {
            _customerService = customerService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpGet("ruc/{ruc}")]
        public async Task<ActionResult<Customer>> GetCustomerByRuc(string ruc)
        {
            var customer = await _customerService.GetCustomerByRucAsync(ruc);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Customer>>> SearchCustomers(string searchTerm)
        {
            var customers = await _customerService.SearchCustomersAsync(searchTerm);
            return Ok(customers);
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _customerService.CreateCustomerAsync(customer);
            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            if (id != customer.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _customerService.CustomerExistsAsync(id))
            {
                return NotFound();
            }

            if (await _customerService.UpdateCustomerAsync(customer))
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Error al actualizar el cliente.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            if (!await _customerService.CustomerExistsAsync(id))
            {
                return NotFound();
            }

            if (await _customerService.DeleteCustomerAsync(id))
            {
                return NoContent();
            }
            else
            {
                return StatusCode(500, "Error al eliminar el cliente.");
            }
        }

        [HttpPost("customerDto")]
        public IActionResult PostCustomerDto(CustomerDto customerDto)
        {
            var customer = customerDto.ToCustomer(); 
            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(customer);
        }

        
        [HttpGet("search-cached")]
        public async Task<ActionResult<IEnumerable<Customer>>> SearchCustomersCached(string searchTerm)
        {
            var customers = await _customerService.SearchCustomersWithCacheAsync(searchTerm);
            return Ok(customers);
        }


    }
}
