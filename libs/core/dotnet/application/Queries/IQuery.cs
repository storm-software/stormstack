using OpenSystem.Core.Application.Interfaces;
using OpenSystem.Core.Application.ReadStores;

namespace OpenSystem.Core.Application.Queries
{
    public interface IQuery<out TResponse> : IBaseRequest<TResponse> { }
}
