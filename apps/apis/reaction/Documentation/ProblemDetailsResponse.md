# OpenSystem.Apis.Reaction..ProblemDetailsResponse
A model for API errors inline with the [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807) specification.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Type** | **string** | A URI reference [RFC3986](https://www.rfc-editor.org/rfc/rfc3986) that identifies the problem type. This specification encourages that, when dereferenced, it provide human-readable documentation for the problem type (e.g., using HTML [W3C.REC-html5-20141028](https://www.rfc-editor.org/rfc/rfc7807#ref-W3C.REC-html5-20141028)). When this member is not present, its value is assumed to be &#x60;about:blank&#x60;. | [default to "about:blank"]
**Title** | **string** | A short, human-readable summary of the problem type. It **SHOULD NOT** change from occurrence to occurrence of the pro**blem, except for purposes of localization (e.g., using proactive content negotiation; see [RFC7231, Section 3.4](https://www.rfc-editor.org/rfc/rfc7231#section-3.4)). | [optional] [default to "An error occurred processing your request."]
**Detail** | **string** | A human-readable explanation specific to this occurrence of the problem. | [optional] 
**Instance** | **string** | A URI reference that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced. | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

