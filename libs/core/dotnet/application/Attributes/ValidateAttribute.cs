namespace OpenSystem.Core.Application.Attributes
{
  /// <summary>
  /// Specifies the class this attribute is applied to require validation on request parameters.
  /// </summary>
  [AttributeUsage(AttributeTargets.Parameter, AllowMultiple = false)]
  public class ValidateAttribute 
    : Attribute
  {
  }
}