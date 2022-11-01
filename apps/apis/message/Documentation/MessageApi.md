# OpenSystem.Apis.Message.OpenSystem.Apis.Message.Controllers.MessageApi

All URIs are relative to *api/v1.0/messages*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AddMessage**](MessageApi.md#addmessage) | **HttpPost** / | Add Message
[**DeleteMessage**](MessageApi.md#deletemessage) | **HttpDelete** /{guid} | Remove Message
[**GetMessage**](MessageApi.md#getmessage) | **HttpGet** /{guid} | Get Message
[**GetMessageList**](MessageApi.md#getmessagelist) | **HttpGet** / | Get Message List
[**UpdateMessage**](MessageApi.md#updatemessage) | **HttpPatch** /{guid} | Update Message


<a name="addmessage"></a>
# **AddMessage**
> UpdateSuccessResponseDto AddMessage (string userId, MessageRequestDto? messageRequestDto)

Add Message

Add new message record

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Controllers;
using OpenSystem.Apis.Message.Client;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Contracts;

namespace Example
{
    public class AddMessageExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/messages";
            var apiInstance = new MessageApi(config);
            var userId = PSUL;  // string | User Id sending request
            var messageRequestDto = new MessageRequestDto?(); // MessageRequestDto? |  (optional) 

            try
            {
                // Add Message
                UpdateSuccessResponseDto result = apiInstance.AddMessage(userId, messageRequestDto);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling MessageApi.AddMessage: " + e.Message );
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
 **userId** | **string**| User Id sending request | 
 **messageRequestDto** | [**MessageRequestDto?**](MessageRequestDto?.md)|  | [optional] 

### Return type

[**UpdateSuccessResponseDto**](UpdateSuccessResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/javascript
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

<a name="deletemessage"></a>
# **DeleteMessage**
> UpdateSuccessResponseDto DeleteMessage (Guid guid, string userId)

Remove Message

Remove an existing message record

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Controllers;
using OpenSystem.Apis.Message.Client;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Contracts;

namespace Example
{
    public class DeleteMessageExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/messages";
            var apiInstance = new MessageApi(config);
            var guid = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Remove Message
                UpdateSuccessResponseDto result = apiInstance.DeleteMessage(guid, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling MessageApi.DeleteMessage: " + e.Message );
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
 **guid** | **Guid**| The records guid | 
 **userId** | **string**| User Id sending request | 

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

<a name="getmessage"></a>
# **GetMessage**
> MessageDto GetMessage (Guid guid, string userId)

Get Message

An end point that returns the system's message literals to a client

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Controllers;
using OpenSystem.Apis.Message.Client;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Contracts;

namespace Example
{
    public class GetMessageExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/messages";
            var apiInstance = new MessageApi(config);
            var guid = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid
            var userId = PSUL;  // string | User Id sending request

            try
            {
                // Get Message
                MessageDto result = apiInstance.GetMessage(guid, userId);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling MessageApi.GetMessage: " + e.Message );
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
 **guid** | **Guid**| The records guid | 
 **userId** | **string**| User Id sending request | 

### Return type

[**MessageDto**](MessageDto.md)

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

<a name="getmessagelist"></a>
# **GetMessageList**
> List&lt;MessageDto&gt; GetMessageList (string messageType, string userId, int? messageNumber)

Get Message List

An end point that returns the system's message literals to a client

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Controllers;
using OpenSystem.Apis.Message.Client;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Contracts;

namespace Example
{
    public class GetMessageListExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/messages";
            var apiInstance = new MessageApi(config);
            var messageType = FXL;  // string | The type of message to return (default to FXL)
            var userId = PSUL;  // string | User Id sending request
            var messageNumber = 56;  // int? | A specific message number to return (optional) 

            try
            {
                // Get Message List
                List<MessageDto> result = apiInstance.GetMessageList(messageType, userId, messageNumber);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling MessageApi.GetMessageList: " + e.Message );
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
 **messageType** | **string**| The type of message to return | [default to FXL]
 **userId** | **string**| User Id sending request | 
 **messageNumber** | **int?**| A specific message number to return | [optional] 

### Return type

[**List&lt;MessageDto&gt;**](MessageDto.md)

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

<a name="updatemessage"></a>
# **UpdateMessage**
> UpdateSuccessResponseDto UpdateMessage (Guid guid, string userId, MessageRequestDto? messageRequestDto)

Update Message

Update an existing message record

### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Controllers;
using OpenSystem.Apis.Message.Client;
using OpenSystem.Apis.Message.OpenSystem.Apis.Message.Contracts;

namespace Example
{
    public class UpdateMessageExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost:3000/messages";
            var apiInstance = new MessageApi(config);
            var guid = 123e4567-e89b-12d3-a456-426614174000;  // Guid | The records guid
            var userId = PSUL;  // string | User Id sending request
            var messageRequestDto = new MessageRequestDto?(); // MessageRequestDto? |  (optional) 

            try
            {
                // Update Message
                UpdateSuccessResponseDto result = apiInstance.UpdateMessage(guid, userId, messageRequestDto);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling MessageApi.UpdateMessage: " + e.Message );
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
 **guid** | **Guid**| The records guid | 
 **userId** | **string**| User Id sending request | 
 **messageRequestDto** | [**MessageRequestDto?**](MessageRequestDto?.md)|  | [optional] 

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

