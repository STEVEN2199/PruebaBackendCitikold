using GestiónInventarioBackend.Dtos;

namespace GestiónInventarioBackend.Interfaces
{
    public interface IAuthService
    {
        Task<AuthServiceResponseDto> SeedRolesAsync();
        Task<AuthServiceResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthServiceResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthServiceResponseDto> MakeAdminAsync(UpdatePermissionDto updatePermissionDto);
        Task<AuthServiceResponseDto> MakeOwnerAsync(UpdatePermissionDto updatePermissionDto);
        Task<AuthServiceResponseDto> RefreshTokenAsync(string refreshToken);
        Task<AuthServiceResponseDto> LoginAsyncPolicy(LoginDto loginDto);
        Task<AuthServiceResponseDto> RegisterPolicyAsync(RegisterPolicyDto registerPolicyDto);
        Task<AuthServiceResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<AuthServiceResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}
