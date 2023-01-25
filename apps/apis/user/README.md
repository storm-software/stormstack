# OpenSystem.Apis.User - ASP.NET Core 7.0 Server

A collection of APIs used to get and set user related data 

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*UsersApi* | [**AddUser**](Documentation/UsersApi.md#adduser) | **HttpPost** /users/{userId} | Add User
*UsersApi* | [**DeleteUser**](Documentation/UsersApi.md#deleteuser) | **HttpDelete** /users/{userId} | Remove User
*UsersApi* | [**GetUser**](Documentation/UsersApi.md#getuser) | **HttpGet** /users/{userId} | Get User
*UsersApi* | [**GetUsers**](Documentation/UsersApi.md#getusers) | **HttpGet** /users | Get Users
*UsersApi* | [**UpdateUser**](Documentation/UsersApi.md#updateuser) | **HttpPut** /users/{userId} | Update User


<a name="documentation-for-models"></a>
## Documentation for Models

 - [OpenSystem.Apis.User.Contracts.ProblemDetailsDto](Documentation/ProblemDetailsDto.md)
 - [OpenSystem.Apis.User.Contracts.RecordBaseDto](Documentation/RecordBaseDto.md)
 - [OpenSystem.Apis.User.Contracts.UpdateSuccessResponseDto](Documentation/UpdateSuccessResponseDto.md)
 - [OpenSystem.Apis.User.Contracts.UpdateUserRequestDto](Documentation/UpdateUserRequestDto.md)
 - [OpenSystem.Apis.User.Contracts.UserAllOfDto](Documentation/UserAllOfDto.md)
 - [OpenSystem.Apis.User.Contracts.UserDto](Documentation/UserDto.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.


## Upgrade NuGet Packages

NuGet packages get frequently updated.

To upgrade this solution to the latest version of all NuGet packages, use the dotnet-outdated tool.


Install dotnet-outdated tool:

```
dotnet tool install --global dotnet-outdated-tool
```

Upgrade only to new minor versions of packages

```
dotnet outdated --upgrade --version-lock Major
```

Upgrade to all new versions of packages (more likely to include breaking API changes)

```
dotnet outdated --upgrade
```


## Run

Linux/OS X:

```
sh build.sh
```

Windows:

```
build.bat
```
## Run in Docker

```
docker build -t apis-user:latest .
docker run -p 5000:8080 apis-user:latest
```
