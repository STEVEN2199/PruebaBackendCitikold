using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GestiónInventarioBackend.Dtos
{
    public class CreateOrderDetailDto
    {
        [Required(ErrorMessage = "El ID del producto es requerido.")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "La cantidad es requerida.")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero.")]
        public int Quantity { get; set; }

    }
}
