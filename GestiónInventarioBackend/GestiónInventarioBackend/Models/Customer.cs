using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GestiónInventarioBackend.Models
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre del cliente es requerido.")]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required(ErrorMessage = "El RUC del cliente es requerido.")]
        [MaxLength(20)]
        public string Ruc { get; set; }

        [Required(ErrorMessage = "El telefono del cliente es requerido.")]
        [MaxLength(20)]
        public string cellphoneNumber { get; set; }

        [Required(ErrorMessage = "El teléfono del cliente es requerido.")]
        [MaxLength(200)]
        public string address { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "El email del cliente es requerido.")]
        [MaxLength(100)]
        public string? Email { get; set; }

    }
}
