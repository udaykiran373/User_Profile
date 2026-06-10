using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace UserProfileApi.Models
{
    public class UserProfileCreateDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string Phone { get; set; } = null!;

        [Required(ErrorMessage = "Location is required")]
        [StringLength(150, ErrorMessage = "Location cannot be longer than 150 characters")]
        public string Location { get; set; } = null!;

        [Required(ErrorMessage = "Profile photo is required")]
        public IFormFile ProfilePhoto { get; set; } = null!;
    }

    public class UserProfileResponseDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string ProfilePhotoUrl { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
