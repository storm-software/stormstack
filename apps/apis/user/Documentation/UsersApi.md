# OpenSystem.Apis.User.OpenSystem.Apis.User.Controllers.UsersApi

All URIs are relative to *api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddUser**](UsersApi.md#adduser) | **HttpPost** /users/{userId} | Add User
[**DeleteUser**](UsersApi.md#deleteuser) | **HttpDelete** /users/{userId} | Remove User
[**GetUser**](UsersApi.md#getuser) | **HttpGet** /users/{userId} | Get User
[**GetUsers**](UsersApi.md#getusers) | **HttpGet** /users | Get Users
[**UpdateUser**](UsersApi.md#updateuser) | **HttpPut** /users/{userId} | Update User


<a name="adduser"></a>
# **AddUser**
> UpdateSuccessResponseDto AddUser (Guid userId, UpdateUserRequestDto? updateUserRequestDto)

Add User

Add a new user

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Controllers;
using OpenSystem.Apis.User.Client;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Contracts;

namespace Example
{
    public class AddUserExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new UsersApi(config);
            var userId = "userId_example";  // Guid | The unique Id used to identify the user
            var updateUserRequestDto = new UpdateUserRequestDto?(); // UpdateUserRequestDto? |  (optional) 

            try
            {
                // Add User
                UpdateSuccessResponseDto result = apiInstance.AddUser(userId, updateUserRequestDto);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling UsersApi.AddUser: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Guid**| The unique Id used to identify the user | 
 **updateUserRequestDto** | [**UpdateUserRequestDto?**](UpdateUserRequestDto?.md)|  | [optional] 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="deleteuser"></a>
# **DeleteUser**
> UpdateSuccessResponseDto DeleteUser (Guid userId)

Remove User

Remove an existing user from the system

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Controllers;
using OpenSystem.Apis.User.Client;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Contracts;

namespace Example
{
    public class DeleteUserExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new UsersApi(config);
            var userId = "userId_example";  // Guid | The unique Id used to identify the user

            try
            {
                // Remove User
                UpdateSuccessResponseDto result = apiInstance.DeleteUser(userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling UsersApi.DeleteUser: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Guid**| The unique Id used to identify the user | 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getuser"></a>
# **GetUser**
> UserDto GetUser (Guid userId)

Get User

An end point that returns data for a specific user

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Controllers;
using OpenSystem.Apis.User.Client;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Contracts;

namespace Example
{
    public class GetUserExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new UsersApi(config);
            var userId = "userId_example";  // Guid | The unique Id used to identify the user

            try
            {
                // Get User
                UserDto result = apiInstance.GetUser(userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling UsersApi.GetUser: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Guid**| The unique Id used to identify the user | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response to Get User end point |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getusers"></a>
# **GetUsers**
> List&lt;UserDto&gt; GetUsers (Guid userId, string? type)

Get Users

An end point that returns the list of users in the system

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Controllers;
using OpenSystem.Apis.User.Client;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Contracts;

namespace Example
{
    public class GetUsersExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new UsersApi(config);
            var userId = "userId_example";  // Guid | The unique Id used to identify the user
            var type = guest;  // string? | The type of the user (optional) 

            try
            {
                // Get Users
                List<UserDto> result = apiInstance.GetUsers(userId, type);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling UsersApi.GetUsers: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Guid**| The unique Id used to identify the user | 
 **type** | **string?**| The type of the user | [optional] 

### Return type

[**List&lt;UserDto&gt;**](UserDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response to Get Users end point |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="updateuser"></a>
# **UpdateUser**
> UpdateSuccessResponseDto UpdateUser (Guid userId, UpdateUserRequestDto? updateUserRequestDto)

Update User

Update an existing user

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Controllers;
using OpenSystem.Apis.User.Client;
using OpenSystem.Apis.User.OpenSystem.Apis.User.Contracts;

namespace Example
{
    public class UpdateUserExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new UsersApi(config);
            var userId = "userId_example";  // Guid | The unique Id used to identify the user
            var updateUserRequestDto = new UpdateUserRequestDto?(); // UpdateUserRequestDto? |  (optional) 

            try
            {
                // Update User
                UpdateSuccessResponseDto result = apiInstance.UpdateUser(userId, updateUserRequestDto);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling UsersApi.UpdateUser: " + e.Message );
                Debug.Print("Status Code: "+ e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Guid**| The unique Id used to identify the user | 
 **updateUserRequestDto** | [**UpdateUserRequestDto?**](UpdateUserRequestDto?.md)|  | [optional] 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

