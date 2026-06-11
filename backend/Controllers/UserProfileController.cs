using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserProfileApi.Models;
using UserProfileApi.Supervisors;

namespace UserProfileApi.Controllers
{
    [ApiController]
    [Route("api/user-profiles")]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileSupervisor _userProfileSupervisor;

        public UserProfileController(IUserProfileSupervisor userProfileSupervisor)
        {
            _userProfileSupervisor = userProfileSupervisor;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<UserProfile>))]
        public async Task<ActionResult<IEnumerable<UserProfile>>> GetAllProfiles()
        {
            var profiles = await _userProfileSupervisor.GetAllProfilesAsync();
            return Ok(profiles);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserProfile))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserProfile>> GetProfileById(string id)
        {
            var profile = await _userProfileSupervisor.GetProfileByIdAsync(id);
            if (profile == null)
            {
                return NotFound(new { message = $"Profile with ID {id} not found." });
            }
            return Ok(profile);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(UserProfile))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<UserProfile>> CreateProfile([FromForm] UserProfile profile, [FromForm] IFormFile profilePhoto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (profilePhoto == null || profilePhoto.Length == 0)
            {
                ModelState.AddModelError("ProfilePhoto", "Profile photo is required and cannot be empty.");
                return ValidationProblem(ModelState);
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var extension = System.IO.Path.GetExtension(profilePhoto.FileName).ToLowerInvariant();
            if (System.Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed." });
            }

            if (profilePhoto.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "Profile photo size must be less than 5MB." });
            }

            if (await _userProfileSupervisor.EmailExistsAsync(profile.Email))
            {
                return Conflict(new { message = "Email is already in use." });
            }

            if (await _userProfileSupervisor.PhoneExistsAsync(profile.Phone))
            {
                return Conflict(new { message = "Phone number is already in use." });
            }

            var createdProfile = await _userProfileSupervisor.CreateProfileAsync(profile, profilePhoto);
            return CreatedAtAction(nameof(GetProfileById), new { id = createdProfile.Id }, createdProfile);
        }
    }
}
