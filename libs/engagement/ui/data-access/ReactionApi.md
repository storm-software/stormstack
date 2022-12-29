# .ReactionApi

All URIs are relative to *http://localhost:5000/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addReaction**](ReactionApi.md#addReaction) | **POST** /articles/{id}/reactions/{type} | Add Reaction
[**deleteReaction**](ReactionApi.md#deleteReaction) | **DELETE** /articles/{id}/reactions/{type} | Remove Reaction
[**getReaction**](ReactionApi.md#getReaction) | **GET** /articles/{id}/reactions/{type} | Get Reaction
[**getReactions**](ReactionApi.md#getReactions) | **GET** /articles/{id}/reactions | Get Reactions


# **addReaction**
> UpdateSuccessResponseDto addReaction()

Add a new reaction to an article

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiAddReactionRequest = {
  // string | The id of the article/page
  id: "id_example",
  // 'LIKE' | 'DISLIKE' | The type of reaction the user had
  type: "LIKE",
  // string | User Id sending request (optional)
  userId: "userId_example",
};

apiInstance.addReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **type** | [**&#39;LIKE&#39; | &#39;DISLIKE&#39;**]**Array<&#39;LIKE&#39; &#124; &#39;DISLIKE&#39;>** | The type of reaction the user had | defaults to undefined
 **userId** | [**string**] | User Id sending request | (optional) defaults to undefined


### Return type

**UpdateSuccessResponseDto**

### Authorization

[bearer-token](README.md#bearer-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **deleteReaction**
> UpdateSuccessResponseDto deleteReaction()

Remove an existing reaction to an article

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiDeleteReactionRequest = {
  // string | The id of the article/page
  id: "id_example",
  // 'LIKE' | 'DISLIKE' | The type of reaction the user had
  type: "LIKE",
  // string | User Id sending request (optional)
  userId: "userId_example",
};

apiInstance.deleteReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **type** | [**&#39;LIKE&#39; | &#39;DISLIKE&#39;**]**Array<&#39;LIKE&#39; &#124; &#39;DISLIKE&#39;>** | The type of reaction the user had | defaults to undefined
 **userId** | [**string**] | User Id sending request | (optional) defaults to undefined


### Return type

**UpdateSuccessResponseDto**

### Authorization

[bearer-token](README.md#bearer-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getReaction**
> GetReaction200ResponseDto getReaction()

An end point that returns the reactions for an article/page to a client

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiGetReactionRequest = {
  // string | The id of the article/page
  id: "id_example",
  // 'LIKE' | 'DISLIKE' | The type of reaction the user had
  type: "LIKE",
  // string | User Id sending request (optional)
  userId: "userId_example",
};

apiInstance.getReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **type** | [**&#39;LIKE&#39; | &#39;DISLIKE&#39;**]**Array<&#39;LIKE&#39; &#124; &#39;DISLIKE&#39;>** | The type of reaction the user had | defaults to undefined
 **userId** | [**string**] | User Id sending request | (optional) defaults to undefined


### Return type

**GetReaction200ResponseDto**

### Authorization

[bearer-token](README.md#bearer-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response to Get Reactions end point |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getReactions**
> GetReactions200ResponseDto getReactions()

An end point that returns the reactions for an article/page to a client

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiGetReactionsRequest = {
  // string | The id of the article/page
  id: "id_example",
  // string | User Id sending request (optional)
  userId: "userId_example",
};

apiInstance.getReactions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **userId** | [**string**] | User Id sending request | (optional) defaults to undefined


### Return type

**GetReactions200ResponseDto**

### Authorization

[bearer-token](README.md#bearer-token)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response to Get Reactions end point |  -  |
**401** | Unauthorized |  -  |
**404** | Not Found |  -  |
**500** | Internal Server Error |  -  |
**503** | Service Unavailable |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


