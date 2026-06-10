using System.Collections.Generic;
using System.Threading.Tasks;
using UserProfileApi.Models;

namespace UserProfileApi.Repositories
{
    public interface IUserProfileRepository
    {
        Task<IEnumerable<UserProfile>> GetAllAsync();
        Task<UserProfile?> GetByIdAsync(string id);
        Task<UserProfile> CreateAsync(UserProfile userProfile);
    }
}
