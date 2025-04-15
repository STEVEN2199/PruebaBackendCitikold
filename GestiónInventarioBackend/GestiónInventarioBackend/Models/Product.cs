using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestiónInventarioBackend.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre del producto es requerido.")]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "El precio del producto es requerido.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a cero.")]
        [Column(TypeName = "decimal(18, 2)")] 
        public decimal Price { get; set; }

        [Required(ErrorMessage = "La cantidad en stock es requerida.")]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad en stock no puede ser negativa.")]
        public int StockQuantity { get; set; }
    }
}
