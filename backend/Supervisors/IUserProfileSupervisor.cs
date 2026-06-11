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
        Task<UserProfile> CreateProfileAsync(UserProfile profile, IFormFile profilePhoto);
    }
}
