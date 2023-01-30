using AutoMapper;
using MediatR;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.Core.DotNet.Application.Models.Parameters;
using OpenSystem.Core.DotNet.Application.Models;
using OpenSystem.User.Domain.Entities;
using OpenSystem.User.Domain.Enums;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using OpenSystem.Core.DotNet.Application.Interfaces;
using OpenSystem.Core.DotNet.Domain.Entities;

namespace OpenSystem.User.Application.Queries.GetUsers
{
    public class GetUsersQuery
      : QueryParameter, IRequest<PagedResponse<IEnumerable<Entity>>>
    {
        public string UserId { get; set; }

        public UserTypes? UserType { get; set; }

        public UserStatusTypes? UserStatusType { get; set; }
    }

    public class GetAllUsersQueryHandler
      : IRequestHandler<GetUsersQuery, PagedResponse<IEnumerable<Entity>>>
    {
        private readonly IUserRepository _userRepository;

        private readonly IMapper _mapper;

        private readonly IModelHelper _modelHelper;

        public GetAllUsersQueryHandler(IUserRepository userRepository,
          IMapper mapper,
          IModelHelper modelHelper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _modelHelper = modelHelper;
        }

        public async Task<PagedResponse<IEnumerable<Entity>>> Handle(GetUsersQuery request,
          CancellationToken cancellationToken)
        {
            var validFilter = request;
            //filtered fields security
            if (!string.IsNullOrEmpty(validFilter.Fields))
            {
                //limit to fields in view model
                validFilter.Fields = _modelHelper.ValidateModelFields<GetUsersViewModel>(validFilter.Fields);
            }
            if (string.IsNullOrEmpty(validFilter.Fields))
            {
                //default fields from view model
                validFilter.Fields = _modelHelper.GetModelFields<GetUsersViewModel>();
            }

            // query based on filter
            var result = await _userRepository.GetUsersAsync(validFilter);
            var data = result.data;
            RecordsCount recordCount = result.recordsCount;

            // Result wrapper
            return new PagedResponse<IEnumerable<Entity>>((List<IEnumerable<Entity>>)data,
              validFilter.PageNumber,
              validFilter.PageSize,
              recordCount);
        }
    }
}
