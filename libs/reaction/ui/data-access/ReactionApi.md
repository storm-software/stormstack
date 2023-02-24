# .ReactionApi

All URIs are relative to *http://localhost:5000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addReaction**](ReactionApi.md#addReaction) | **POST** /reactions/{contentId} | Add Reaction
[**getReactions**](ReactionApi.md#getReactions) | **GET** /reactions/{contentId} | Get Reactions
[**getReactionsCount**](ReactionApi.md#getReactionsCount) | **GET** /reactions/{contentId}/count | Get Reaction Counts
[**removeReaction**](ReactionApi.md#removeReaction) | **DELETE** /reactions/{contentId} | Remove Reaction


# **addReaction**
> CommandSuccessResponse addReaction()

Add a new reaction to an article

### Example


```typescript
import {  } from 'reaction-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiAddReactionRequest = {
  // string | The id of the article/comment
  contentId: "contentId_example",
  // AddReactionRequest (optional)
  addReactionRequest: {
    type: "like",
  },
};

apiInstance.addReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addReactionRequest** | **AddReactionRequest**|  |
 **contentId** | [**string**] | The id of the article/comment | defaults to undefined


### Return type

**CommandSuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
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

# **getReactions**
> GetReactions200Response getReactions()

Return the reactions for a specific article, comment, etc. 

### Example


```typescript
import {  } from 'reaction-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiGetReactionsRequest = {
  // string | The id of the article/comment
  contentId: "contentId_example",
  // number | The current page number of the selected data
  pageNumber: 1,
  // number | The maximum amount of data to return in one request
  pageSize: 200,
  // string | The field to order the request by
  orderBy: "id",
  // 'like' | 'dislike' | 'laugh' | 'cry' | The type of reaction the user had (optional)
  type: "like",
};

apiInstance.getReactions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | [**string**] | The id of the article/comment | defaults to undefined
 **pageNumber** | [**number**] | The current page number of the selected data | defaults to 1
 **pageSize** | [**number**] | The maximum amount of data to return in one request | defaults to 200
 **orderBy** | [**string**] | The field to order the request by | defaults to 'id'
 **type** | [**&#39;like&#39; | &#39;dislike&#39; | &#39;laugh&#39; | &#39;cry&#39;**]**Array<&#39;like&#39; &#124; &#39;dislike&#39; &#124; &#39;laugh&#39; &#124; &#39;cry&#39;>** | The type of reaction the user had | (optional) defaults to undefined


### Return type

**GetReactions200Response**

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

# **getReactionsCount**
> GetReactionsCount200Response getReactionsCount()

Return the reaction counts for a specific article, comment, etc. 

### Example


```typescript
import {  } from 'reaction-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiGetReactionsCountRequest = {
  // string | The id of the article/comment
  contentId: "contentId_example",
  // 'like' | 'dislike' | 'laugh' | 'cry' | The type of reaction the user had (optional)
  type: "like",
};

apiInstance.getReactionsCount(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | [**string**] | The id of the article/comment | defaults to undefined
 **type** | [**&#39;like&#39; | &#39;dislike&#39; | &#39;laugh&#39; | &#39;cry&#39;**]**Array<&#39;like&#39; &#124; &#39;dislike&#39; &#124; &#39;laugh&#39; &#124; &#39;cry&#39;>** | The type of reaction the user had | (optional) defaults to undefined


### Return type

**GetReactionsCount200Response**

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

# **removeReaction**
> CommandSuccessResponse removeReaction()

Remove an existing reaction to an article

### Example


```typescript
import {  } from 'reaction-ui-data-access';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ReactionApi(configuration);

let body:.ReactionApiRemoveReactionRequest = {
  // string | The id of the article/comment
  contentId: "contentId_example",
};

apiInstance.removeReaction(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | [**string**] | The id of the article/comment | defaults to undefined


### Return type

**CommandSuccessResponse**

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


