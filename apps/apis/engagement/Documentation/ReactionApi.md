# OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Controllers.ReactionApi

All URIs are relative to *api/v1.0/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddReaction**](ReactionApi.md#addreaction) | **HttpPost** /articles/{id}/reactions/{type} | Add Reaction
[**DeleteReaction**](ReactionApi.md#deletereaction) | **HttpDelete** /articles/{id}/reactions/{type} | Remove Reaction
[**GetReaction**](ReactionApi.md#getreaction) | **HttpGet** /articles/{id}/reactions/{type} | Get Reaction
[**GetReactions**](ReactionApi.md#getreactions) | **HttpGet** /articles/{id}/reactions | Get Reactions


<a name="addreaction"></a>
# **AddReaction**
> UpdateSuccessResponseDto AddReaction (string id, string type, string userId)

Add Reaction

Add a new reaction to an article

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Controllers;
using OpenSystem.Apis.Engagement.Client;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Contracts;

namespace Example
{
    public class AddReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/api";
            // Configure Bearer token for authorization: bearer-token
            config.AccessToken = "YOUR_BEARER_TOKEN";

            var apiInstance = new ReactionApi(config);
            var id = "id_example";  // string | The id of the article/page
            var type = LIKE;  // string | The type of reaction the user had
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Add Reaction
                UpdateSuccessResponseDto result = apiInstance.AddReaction(id, type, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionApi.AddReaction: " + e.Message );
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
 **id** | **string**| The id of the article/page | 
 **type** | **string**| The type of reaction the user had | 
 **userId** | **string**| User Id sending request | 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

### Authorization

[bearer-token](../README.md#bearer-token)

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
> UpdateSuccessResponseDto DeleteReaction (string id, string type, string userId)

Remove Reaction

Remove an existing reaction to an article

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Controllers;
using OpenSystem.Apis.Engagement.Client;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Contracts;

namespace Example
{
    public class DeleteReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/api";
            // Configure Bearer token for authorization: bearer-token
            config.AccessToken = "YOUR_BEARER_TOKEN";

            var apiInstance = new ReactionApi(config);
            var id = "id_example";  // string | The id of the article/page
            var type = LIKE;  // string | The type of reaction the user had
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Remove Reaction
                UpdateSuccessResponseDto result = apiInstance.DeleteReaction(id, type, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionApi.DeleteReaction: " + e.Message );
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
 **id** | **string**| The id of the article/page | 
 **type** | **string**| The type of reaction the user had | 
 **userId** | **string**| User Id sending request | 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

### Authorization

[bearer-token](../README.md#bearer-token)

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
> GetReaction200ResponseDto GetReaction (string id, string type, string userId)

Get Reaction

An end point that returns the reactions for an article/page to a client

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Controllers;
using OpenSystem.Apis.Engagement.Client;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Contracts;

namespace Example
{
    public class GetReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/api";
            // Configure Bearer token for authorization: bearer-token
            config.AccessToken = "YOUR_BEARER_TOKEN";

            var apiInstance = new ReactionApi(config);
            var id = "id_example";  // string | The id of the article/page
            var type = LIKE;  // string | The type of reaction the user had
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Get Reaction
                GetReaction200ResponseDto result = apiInstance.GetReaction(id, type, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionApi.GetReaction: " + e.Message );
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
 **id** | **string**| The id of the article/page | 
 **type** | **string**| The type of reaction the user had | 
 **userId** | **string**| User Id sending request | 

### Return type

[**GetReaction200ResponseDto**](GetReaction200ResponseDto.md)

### Authorization

[bearer-token](../README.md#bearer-token)

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
> GetReactions200ResponseDto GetReactions (string id, string userId)

Get Reactions

An end point that returns the reactions for an article/page to a client

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Controllers;
using OpenSystem.Apis.Engagement.Client;
using OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Contracts;

namespace Example
{
    public class GetReactionsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/api";
            // Configure Bearer token for authorization: bearer-token
            config.AccessToken = "YOUR_BEARER_TOKEN";

            var apiInstance = new ReactionApi(config);
            var id = "id_example";  // string | The id of the article/page
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Get Reactions
                GetReactions200ResponseDto result = apiInstance.GetReactions(id, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionApi.GetReactions: " + e.Message );
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
 **id** | **string**| The id of the article/page | 
 **userId** | **string**| User Id sending request | 

### Return type

[**GetReactions200ResponseDto**](GetReactions200ResponseDto.md)

### Authorization

[bearer-token](../README.md#bearer-token)

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

