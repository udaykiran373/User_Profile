using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using UserProfileApi.Models;
using UserProfileApi.Repositories;

namespace UserProfileApi.Supervisors
{
    public class UserProfileSupervisor : IUserProfileSupervisor
    {
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public UserProfileSupervisor(
            IUserProfileRepository userProfileRepository,
            IWebHostEnvironment webHostEnvironment)
        {
            _userProfileRepository = userProfileRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<IEnumerable<UserProfile>> GetAllProfilesAsync()
        {
            return await _userProfileRepository.GetAllAsync();
        }

        public async Task<UserProfile?> GetProfileByIdAsync(string id)
        {
            return await _userProfileRepository.GetByIdAsync(id);
        }

        public async Task<UserProfile> CreateProfileAsync(UserProfile profile, IFormFile profilePhoto)
        {
            var webRootPath = _webHostEnvironment.WebRootPath;
            if (string.IsNullOrEmpty(webRootPath))
            {
                webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var uploadsFolder = Path.Combine(webRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(profilePhoto.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await profilePhoto.CopyToAsync(fileStream);
            }

            profile.Id = null;
            profile.ProfilePhotoUrl = $"/uploads/{uniqueFileName}";
            profile.CreatedAt = DateTime.UtcNow;

            var savedProfile = await _userProfileRepository.CreateAsync(profile);
            return savedProfile;
        }
    }
}
