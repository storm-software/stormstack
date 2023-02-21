# OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers.ReactionApi

All URIs are relative to *api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddReaction**](ReactionApi.md#addreaction) | **HttpPost** /reactions/{contentId} | Add Reaction
[**GetReactions**](ReactionApi.md#getreactions) | **HttpGet** /reactions/{contentId} | Get Reactions
[**GetReactionsCount**](ReactionApi.md#getreactionscount) | **HttpGet** /reactions/{contentId}/count | Get Reaction Counts
[**RemoveReaction**](ReactionApi.md#removereaction) | **HttpDelete** /reactions/{contentId} | Remove Reaction


<a name="addreaction"></a>
# **AddReaction**
> CommandSuccessResponse AddReaction (string contentId, AddReactionRequest? addReactionRequest)

Add Reaction

Add a new reaction to an article

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.;

namespace Example
{
    public class AddReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionApi(config);
            var contentId = "contentId_example";  // string | The id of the article/comment
            var addReactionRequest = new AddReactionRequest?(); // AddReactionRequest? |  (optional) 

            try
            {
                // Add Reaction
                CommandSuccessResponse result = apiInstance.AddReaction(contentId, addReactionRequest);
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
 **contentId** | **string**| The id of the article/comment | 
 **addReactionRequest** | [**AddReactionRequest?**](AddReactionRequest?.md)|  | [optional] 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

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

<a name="getreactions"></a>
# **GetReactions**
> GetReactions200Response GetReactions (string contentId, int pageNumber, int pageSize, string orderBy, string? type)

Get Reactions

Return the reactions for a specific article, comment, etc. 

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.;

namespace Example
{
    public class GetReactionsExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionApi(config);
            var contentId = "contentId_example";  // string | The id of the article/comment
            var pageNumber = 1;  // int | The current page number of the selected data (default to 1)
            var pageSize = 200;  // int | The maximum amount of data to return in one request (default to 200)
            var orderBy = "\"id\"";  // string | The field to order the request by (default to "id")
            var type = like;  // string? | The type of reaction the user had (optional) 

            try
            {
                // Get Reactions
                GetReactions200Response result = apiInstance.GetReactions(contentId, pageNumber, pageSize, orderBy, type);
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
 **contentId** | **string**| The id of the article/comment | 
 **pageNumber** | **int**| The current page number of the selected data | [default to 1]
 **pageSize** | **int**| The maximum amount of data to return in one request | [default to 200]
 **orderBy** | **string**| The field to order the request by | [default to &quot;id&quot;]
 **type** | **string?**| The type of reaction the user had | [optional] 

### Return type

[**GetReactions200Response**](GetReactions200Response.md)

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

<a name="getreactionscount"></a>
# **GetReactionsCount**
> GetReactionsCount200Response GetReactionsCount (string contentId, string? type)

Get Reaction Counts

Return the reaction counts for a specific article, comment, etc. 

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.;

namespace Example
{
    public class GetReactionsCountExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionApi(config);
            var contentId = "contentId_example";  // string | The id of the article/comment
            var type = like;  // string? | The type of reaction the user had (optional) 

            try
            {
                // Get Reaction Counts
                GetReactionsCount200Response result = apiInstance.GetReactionsCount(contentId, type);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionApi.GetReactionsCount: " + e.Message );
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
 **contentId** | **string**| The id of the article/comment | 
 **type** | **string?**| The type of reaction the user had | [optional] 

### Return type

[**GetReactionsCount200Response**](GetReactionsCount200Response.md)

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

<a name="removereaction"></a>
# **RemoveReaction**
> CommandSuccessResponse RemoveReaction (string contentId)

Remove Reaction

Remove an existing reaction to an article

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Reaction.OpenSystem.Apis.Reaction.Controllers;
using OpenSystem.Apis.Reaction.Client;
using OpenSystem.Apis.Reaction.;

namespace Example
{
    public class RemoveReactionExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:5000";
            var apiInstance = new ReactionApi(config);
            var contentId = "contentId_example";  // string | The id of the article/comment

            try
            {
                // Remove Reaction
                CommandSuccessResponse result = apiInstance.RemoveReaction(contentId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ReactionApi.RemoveReaction: " + e.Message );
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
 **contentId** | **string**| The id of the article/comment | 

### Return type

[**CommandSuccessResponse**](CommandSuccessResponse.md)

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

