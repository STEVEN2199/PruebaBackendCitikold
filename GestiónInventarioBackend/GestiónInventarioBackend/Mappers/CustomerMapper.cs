using GestiónInventarioBackend.Models;
using GestiónInventarioBackend.Dtos;

namespace GestiónInventarioBackend.Mappers
{
    public static class CustomerMapper
    {
        public static Customer ToCustomerDto(this CustomerDto customerDto)
        {
            return new Customer
            {
                
                Id = customerDto.Id,
                Name = customerDto.Name,
                Ruc = customerDto.Ruc,
                cellphoneNumber = customerDto.cellphoneNumber,
                address = customerDto.address,
                Email = customerDto.Email
            };

        }

    }
}
