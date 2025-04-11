using System.ComponentModel.DataAnnotations;

namespace GestiónInventarioBackend.Dtos
{
    public class RefreshTokenDto
    {

        [Required(ErrorMessage = "RefreshToken is required")]
        public string RefreshToken { get; set; }
    }
}
