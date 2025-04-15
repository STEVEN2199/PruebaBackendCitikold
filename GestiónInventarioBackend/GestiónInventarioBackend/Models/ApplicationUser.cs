using Microsoft.AspNetCore.Identity;

namespace GestiónInventarioBackend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string RefreshToken { get; set; } = string.Empty;  
        public DateTime RefreshTokenExpiryTime { get; set; } // Expiración del Refresh Token
        public int Age { get; set; } 
    }
}
