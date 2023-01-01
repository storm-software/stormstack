# .ReactionsApi

All URIs are relative to *http://localhost:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addArticleReaction**](ReactionsApi.md#addArticleReaction) | **POST** /article/{id}/reaction/{type} | Add Reaction
[**deleteArticleReaction**](ReactionsApi.md#deleteArticleReaction) | **DELETE** /article/{id}/reaction/{type} | Remove Reaction
[**getArticleReaction**](ReactionsApi.md#getArticleReaction) | **GET** /article/{id}/reaction/{type} | Get Reaction
[**getArticleReactions**](ReactionsApi.md#getArticleReactions) | **GET** /article/{id} | Get Article Reactions


# **addArticleReaction**
> UpdateSuccessResponse addArticleReaction()

Add a new reaction to an article

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionsApi(configuration);

let body:.ReactionsApiAddArticleReactionRequest = {
  // string | The id of the article/page
  id: "id_example",
  // 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry' | The type of reaction the user had
  type: "like",
  // string | The id of the current user sending the request
  userId: "userId_example",
};

apiInstance.addArticleReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **type** | [**&#39;like&#39; | &#39;dislike&#39; | &#39;happy&#39; | &#39;sad&#39; | &#39;laugh&#39; | &#39;cry&#39;**]**Array<&#39;like&#39; &#124; &#39;dislike&#39; &#124; &#39;happy&#39; &#124; &#39;sad&#39; &#124; &#39;laugh&#39; &#124; &#39;cry&#39;>** | The type of reaction the user had | defaults to undefined
 **userId** | [**string**] | The id of the current user sending the request | defaults to undefined


### Return type

**UpdateSuccessResponse**

### Authorization

No authorization required

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

# **deleteArticleReaction**
> UpdateSuccessResponse deleteArticleReaction()

Remove an existing reaction to an article

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionsApi(configuration);

let body:.ReactionsApiDeleteArticleReactionRequest = {
  // string | The id of the article/page
  id: "id_example",
  // 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry' | The type of reaction the user had
  type: "like",
  // string | The id of the current user sending the request
  userId: "userId_example",
};

apiInstance.deleteArticleReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **type** | [**&#39;like&#39; | &#39;dislike&#39; | &#39;happy&#39; | &#39;sad&#39; | &#39;laugh&#39; | &#39;cry&#39;**]**Array<&#39;like&#39; &#124; &#39;dislike&#39; &#124; &#39;happy&#39; &#124; &#39;sad&#39; &#124; &#39;laugh&#39; &#124; &#39;cry&#39;>** | The type of reaction the user had | defaults to undefined
 **userId** | [**string**] | The id of the current user sending the request | defaults to undefined


### Return type

**UpdateSuccessResponse**

### Authorization

No authorization required

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

# **getArticleReaction**
> GetArticleReaction200Response getArticleReaction()

An end point that returns the reactions for an article/page to a client

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionsApi(configuration);

let body:.ReactionsApiGetArticleReactionRequest = {
  // string | The id of the article/page
  id: "id_example",
  // 'like' | 'dislike' | 'happy' | 'sad' | 'laugh' | 'cry' | The type of reaction the user had
  type: "like",
  // string | The id of the current user sending the request
  userId: "userId_example",
};

apiInstance.getArticleReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **type** | [**&#39;like&#39; | &#39;dislike&#39; | &#39;happy&#39; | &#39;sad&#39; | &#39;laugh&#39; | &#39;cry&#39;**]**Array<&#39;like&#39; &#124; &#39;dislike&#39; &#124; &#39;happy&#39; &#124; &#39;sad&#39; &#124; &#39;laugh&#39; &#124; &#39;cry&#39;>** | The type of reaction the user had | defaults to undefined
 **userId** | [**string**] | The id of the current user sending the request | defaults to undefined


### Return type

**GetArticleReaction200Response**

### Authorization

No authorization required

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

# **getArticleReactions**
> GetArticleReactions200Response getArticleReactions()

An end point that returns the reactions for an article/page to a client

### Example


```typescript
import {  } from 'engagement-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionsApi(configuration);

let body:.ReactionsApiGetArticleReactionsRequest = {
  // string | The id of the article/page
  id: "id_example",
  // string | The id of the current user sending the request
  userId: "userId_example",
};

apiInstance.getArticleReactions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**string**] | The id of the article/page | defaults to undefined
 **userId** | [**string**] | The id of the current user sending the request | defaults to undefined


### Return type

**GetArticleReactions200Response**

### Authorization

No authorization required

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


