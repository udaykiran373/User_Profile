using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using UserProfileApi.Models;

namespace UserProfileApi.Supervisors
{
    public interface IUserProfileSupervisor
    {
        Task<IEnumerable<UserProfile>> GetAllProfilesAsync();
        Task<UserProfile?> GetProfileByIdAsync(string id);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> PhoneExistsAsync(string phone);
        Task<UserProfile> CreateProfileAsync(UserProfile profile, IFormFile profilePhoto);
    }
}
