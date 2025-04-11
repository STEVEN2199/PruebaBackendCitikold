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
        public string Name { get; set; }

        [Required(ErrorMessage = "El RUC del cliente es requerido.")]
        public string Ruc { get; set; }

        [Required(ErrorMessage = "El telefono del cliente es requerido.")]
        public string cellphoneNumber { get; set; }

        [Required(ErrorMessage = "El teléfono del cliente es requerido.")]
        public string address { get; set; }

    }
}
