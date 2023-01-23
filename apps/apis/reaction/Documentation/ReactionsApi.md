# OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers.ReactionsApi

All URIs are relative to *api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddReaction**](ReactionsApi.md#addreaction) | **HttpPost** /reactions/{contentType}/{contentId}/reaction/{reactionType} | Add Reaction
[**DeleteReaction**](ReactionsApi.md#deletereaction) | **HttpDelete** /reactions/{contentType}/{contentId}/reaction/{reactionType} | Remove Reaction
[**GetReaction**](ReactionsApi.md#getreaction) | **HttpGet** /reactions/{contentType}/{contentId}/reaction/{reactionType} | Get Reaction
[**GetReactions**](ReactionsApi.md#getreactions) | **HttpGet** /reactions/{contentType}/{contentId} | Get Reactions


<a name="addreaction"></a>
# **AddReaction**
> UpdateSuccessResponseDto AddReaction (string contentType, Guid contentId, string userId)

Add Reaction

Add a new reaction to an article

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Contracts;

namespace Example
{
    public class AddReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionsApi(config);
            var contentType = article;  // string | The type of content the user is engaging with
            var contentId = "contentId_example";  // Guid | The id of the content (ex: articleId, commentId, etc.)
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Add Reaction
                UpdateSuccessResponseDto result = apiInstance.AddReaction(contentType, contentId, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.AddReaction: " + e.Message );
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
 **contentType** | **string**| The type of content the user is engaging with | 
 **contentId** | **Guid**| The id of the content (ex: articleId, commentId, etc.) | 
 **userId** | **string**| The id of the current user sending the request | 

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

<a name="deletereaction"></a>
# **DeleteReaction**
> UpdateSuccessResponseDto DeleteReaction (string contentType, Guid contentId, string userId)

Remove Reaction

Remove an existing reaction to an article

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Contracts;

namespace Example
{
    public class DeleteReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionsApi(config);
            var contentType = article;  // string | The type of content the user is engaging with
            var contentId = "contentId_example";  // Guid | The id of the content (ex: articleId, commentId, etc.)
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Remove Reaction
                UpdateSuccessResponseDto result = apiInstance.DeleteReaction(contentType, contentId, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.DeleteReaction: " + e.Message );
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
 **contentType** | **string**| The type of content the user is engaging with | 
 **contentId** | **Guid**| The id of the content (ex: articleId, commentId, etc.) | 
 **userId** | **string**| The id of the current user sending the request | 

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

<a name="getreaction"></a>
# **GetReaction**
> GetReaction200ResponseDto GetReaction (string contentType, Guid contentId, string userId)

Get Reaction

An end point that returns the reactions for an article/page to a client

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Contracts;

namespace Example
{
    public class GetReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionsApi(config);
            var contentType = article;  // string | The type of content the user is engaging with
            var contentId = "contentId_example";  // Guid | The id of the content (ex: articleId, commentId, etc.)
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Reaction
                GetReaction200ResponseDto result = apiInstance.GetReaction(contentType, contentId, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.GetReaction: " + e.Message );
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
 **contentType** | **string**| The type of content the user is engaging with | 
 **contentId** | **Guid**| The id of the content (ex: articleId, commentId, etc.) | 
 **userId** | **string**| The id of the current user sending the request | 

### Return type

[**GetReaction200ResponseDto**](GetReaction200ResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response to Get Reactions end point |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="getreactions"></a>
# **GetReactions**
> GetReactions200ResponseDto GetReactions (string contentType, Guid contentId, string userId)

Get Reactions

An end point that returns the reactions for an article/page to a client

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Contracts;

namespace Example
{
    public class GetReactionsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionsApi(config);
            var contentType = article;  // string | The type of content the user is engaging with
            var contentId = "contentId_example";  // Guid | The id of the content (ex: articleId, commentId, etc.)
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Reactions
                GetReactions200ResponseDto result = apiInstance.GetReactions(contentType, contentId, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.GetReactions: " + e.Message );
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
 **contentType** | **string**| The type of content the user is engaging with | 
 **contentId** | **Guid**| The id of the content (ex: articleId, commentId, etc.) | 
 **userId** | **string**| The id of the current user sending the request | 

### Return type

[**GetReactions200ResponseDto**](GetReactions200ResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response to Get Reactions end point |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |
| **503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

