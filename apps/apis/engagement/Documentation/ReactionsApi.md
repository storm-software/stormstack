# OpenSystem.Apis.Engagement.OpenSystem.Apis.Engagement.Controllers.ReactionsApi

All URIs are relative to *api/v1.0/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddArticleReaction**](ReactionsApi.md#addarticlereaction) | **HttpPost** /article/{id}/reaction/{type} | Add Reaction
[**DeleteArticleReaction**](ReactionsApi.md#deletearticlereaction) | **HttpDelete** /article/{id}/reaction/{type} | Remove Reaction
[**GetArticleReaction**](ReactionsApi.md#getarticlereaction) | **HttpGet** /article/{id}/reaction/{type} | Get Reaction
[**GetArticleReactions**](ReactionsApi.md#getarticlereactions) | **HttpGet** /article/{id} | Get Article Reactions


<a name="addarticlereaction"></a>
# **AddArticleReaction**
> UpdateSuccessResponseDto AddArticleReaction (string id, string type, string userId)

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
    public class AddArticleReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000/api";
            var apiInstance = new ReactionsApi(config);
            var id = "id_example";  // string | The id of the article/page
            var type = like;  // string | The type of reaction the user had
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Add Reaction
                UpdateSuccessResponseDto result = apiInstance.AddArticleReaction(id, type, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.AddArticleReaction: " + e.Message );
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

<a name="deletearticlereaction"></a>
# **DeleteArticleReaction**
> UpdateSuccessResponseDto DeleteArticleReaction (string id, string type, string userId)

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
    public class DeleteArticleReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000/api";
            var apiInstance = new ReactionsApi(config);
            var id = "id_example";  // string | The id of the article/page
            var type = like;  // string | The type of reaction the user had
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Remove Reaction
                UpdateSuccessResponseDto result = apiInstance.DeleteArticleReaction(id, type, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.DeleteArticleReaction: " + e.Message );
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

<a name="getarticlereaction"></a>
# **GetArticleReaction**
> GetArticleReaction200ResponseDto GetArticleReaction (string id, string type, string userId)

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
    public class GetArticleReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000/api";
            var apiInstance = new ReactionsApi(config);
            var id = "id_example";  // string | The id of the article/page
            var type = like;  // string | The type of reaction the user had
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Reaction
                GetArticleReaction200ResponseDto result = apiInstance.GetArticleReaction(id, type, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.GetArticleReaction: " + e.Message );
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
 **userId** | **string**| The id of the current user sending the request | 

### Return type

[**GetArticleReaction200ResponseDto**](GetArticleReaction200ResponseDto.md)

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

<a name="getarticlereactions"></a>
# **GetArticleReactions**
> GetArticleReactions200ResponseDto GetArticleReactions (string id, string userId)

Get Article Reactions

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
    public class GetArticleReactionsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000/api";
            var apiInstance = new ReactionsApi(config);
            var id = "id_example";  // string | The id of the article/page
            var userId = "userId_example";  // string | The id of the current user sending the request

            try
            {
                // Get Article Reactions
                GetArticleReactions200ResponseDto result = apiInstance.GetArticleReactions(id, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionsApi.GetArticleReactions: " + e.Message );
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
 **userId** | **string**| The id of the current user sending the request | 

### Return type

[**GetArticleReactions200ResponseDto**](GetArticleReactions200ResponseDto.md)

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

