using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace UserProfileApi.Models
{
    public class UserProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("phone")]
        public string Phone { get; set; } = null!;

        [BsonElement("location")]
        public string Location { get; set; } = null!;

        [BsonElement("profilePhotoUrl")]
        public string ProfilePhotoUrl { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
