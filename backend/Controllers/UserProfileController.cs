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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<UserProfileResponseDto>))]
        public async Task<ActionResult<IEnumerable<UserProfileResponseDto>>> GetAllProfiles()
        {
            var profiles = await _userProfileSupervisor.GetAllProfilesAsync();
            return Ok(profiles);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserProfileResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserProfileResponseDto>> GetProfileById(string id)
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
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(UserProfileResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserProfileResponseDto>> CreateProfile([FromForm] UserProfileCreateDto createDto)
        {
            if (createDto.ProfilePhoto == null || createDto.ProfilePhoto.Length == 0)
            {
                return BadRequest(new { message = "Profile photo is required and cannot be empty." });
            }

            // Optional: Validate file extension/size
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var extension = System.IO.Path.GetExtension(createDto.ProfilePhoto.FileName).ToLowerInvariant();
            if (System.Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed." });
            }

            var profile = await _userProfileSupervisor.CreateProfileAsync(createDto);
            return CreatedAtAction(nameof(GetProfileById), new { id = profile.Id }, profile);
        }
    }
}
