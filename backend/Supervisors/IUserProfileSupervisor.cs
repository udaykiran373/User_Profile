using System.Collections.Generic;
using System.Threading.Tasks;
using UserProfileApi.Models;

namespace UserProfileApi.Supervisors
{
    public interface IUserProfileSupervisor
    {
        Task<IEnumerable<UserProfileResponseDto>> GetAllProfilesAsync();
        Task<UserProfileResponseDto?> GetProfileByIdAsync(string id);
        Task<UserProfileResponseDto> CreateProfileAsync(UserProfileCreateDto createDto);
    }
}
