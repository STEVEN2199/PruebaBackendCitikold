using GestiónInventarioBackend.Models;

namespace GestiónInventarioBackend.Dtos
{
    public class CustomerDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Ruc { get; set; }

        public string cellphoneNumber { get; set; }

        public string address { get; set; }

        public string? Email { get; set; }


        public Customer ToCustomer()
        {
            return new Customer
            {
                Id = this.Id,
                Name = this.Name,
                Ruc = this.Ruc,
                cellphoneNumber = this.cellphoneNumber,
                address = this.address,
                Email = this.Email
            };
        }

    }
}
