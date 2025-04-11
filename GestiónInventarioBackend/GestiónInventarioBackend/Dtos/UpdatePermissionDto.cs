using System.ComponentModel.DataAnnotations;

namespace GestiónInventarioBackend.Dtos
{
    public class UpdatePermissionDto
    {
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; }
    }
}
