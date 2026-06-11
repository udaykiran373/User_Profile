using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace UserProfileApi.Models
{
    public class UserProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; } = null!;

        [BsonElement("email")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = null!;

        [BsonElement("phone")]
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression(@"^\+?[0-9\s-]{7,15}$", ErrorMessage = "Phone number must contain 7-15 digits and can include +, spaces, or dashes.")]
        public string Phone { get; set; } = null!;

        [BsonElement("location")]
        [Required(ErrorMessage = "Location is required")]
        [StringLength(150, ErrorMessage = "Location cannot be longer than 150 characters")]
        public string Location { get; set; } = null!;

        [BsonElement("profilePhotoUrl")]
        public string? ProfilePhotoUrl { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
