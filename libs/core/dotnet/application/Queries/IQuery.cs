using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Domain.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQuery<out TResponse> : IBaseRequest<TResponse> { }
}
