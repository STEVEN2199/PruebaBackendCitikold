using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GestiónInventarioBackend.Dtos
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "El ID del cliente es requerido.")]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "La fecha del pedido es requerida.")]
        public DateTime OrderDate { get; set; }

        public decimal Subtotal { get; set; }

        public decimal Iva { get; set; } // IVA para Ecuador

        public decimal Total { get; set; }

        [Required(ErrorMessage = "Debe haber al menos un detalle en el pedido.")]
        public List<CreateOrderDetailDto> OrderDetails { get; set; }
    }
}
