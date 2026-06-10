using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using UserProfileApi.Models;
using UserProfileApi.Repositories;
using UserProfileApi.Supervisors;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

// Register layers for Honeycomb Architecture (DI)
builder.Services.AddSingleton<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddTransient<IUserProfileSupervisor, UserProfileSupervisor>();

builder.Services.AddControllers();

// Configure CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");

// Serve static files from wwwroot (holds uploaded profile pictures)
app.UseStaticFiles();

app.MapControllers();

app.Run();
