using MediatR;

namespace OpenSystem.Core.Application.Interfaces
{
  public interface ICommand<TResponse>
    : IRequest<TResponse>
  {
      /// <summary>
      /// Gets or sets the Guid for the underlying data
      /// </summary>
      /// <remarks>This field is null during a create request</remarks>
      Guid? Id { get; set; }
  }
}
