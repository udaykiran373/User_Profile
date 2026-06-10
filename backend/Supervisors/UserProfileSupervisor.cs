using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

        public async Task<IEnumerable<UserProfileResponseDto>> GetAllProfilesAsync()
        {
            var profiles = await _userProfileRepository.GetAllAsync();
            return profiles.Select(p => MapToResponseDto(p)).ToList();
        }

        public async Task<UserProfileResponseDto?> GetProfileByIdAsync(string id)
        {
            var profile = await _userProfileRepository.GetByIdAsync(id);
            if (profile == null) return null;
            return MapToResponseDto(profile);
        }

        public async Task<UserProfileResponseDto> CreateProfileAsync(UserProfileCreateDto createDto)
        {
            // Determine webroot path (fallback if webroot is not initialized yet in testing/some environments)
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

            // Create unique file name
            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(createDto.ProfilePhoto.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file to disk
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await createDto.ProfilePhoto.CopyToAsync(fileStream);
            }

            // Map and Save to MongoDB
            var userProfile = new UserProfile
            {
                Name = createDto.Name,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Location = createDto.Location,
                ProfilePhotoUrl = $"/uploads/{uniqueFileName}",
                CreatedAt = DateTime.UtcNow
            };

            var savedProfile = await _userProfileRepository.CreateAsync(userProfile);
            return MapToResponseDto(savedProfile);
        }

        private static UserProfileResponseDto MapToResponseDto(UserProfile profile)
        {
            return new UserProfileResponseDto
            {
                Id = profile.Id ?? string.Empty,
                Name = profile.Name,
                Email = profile.Email,
                Phone = profile.Phone,
                Location = profile.Location,
                ProfilePhotoUrl = profile.ProfilePhotoUrl,
                CreatedAt = profile.CreatedAt
            };
        }
    }
}
