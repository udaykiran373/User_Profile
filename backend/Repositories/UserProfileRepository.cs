using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserProfileApi.Models;

namespace UserProfileApi.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly IMongoCollection<UserProfile> _userProfilesCollection;

        public UserProfileRepository(IOptions<DatabaseSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _userProfilesCollection = mongoDatabase.GetCollection<UserProfile>(databaseSettings.Value.CollectionName);
        }

        public async Task<IEnumerable<UserProfile>> GetAllAsync()
        {
            return await _userProfilesCollection.Find(_ => true).ToListAsync();
        }

        public async Task<UserProfile?> GetByIdAsync(string id)
        {
            return await _userProfilesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<UserProfile> CreateAsync(UserProfile userProfile)
        {
            await _userProfilesCollection.InsertOneAsync(userProfile);
            return userProfile;
        }
    }
}
