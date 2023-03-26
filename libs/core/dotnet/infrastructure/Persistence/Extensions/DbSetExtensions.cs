using System;
using System.Collections;
using System.Collections.Generic;
using AutoMapper;
using AutoMapper.Extensions.ExpressionMapping.Impl;
using Microsoft.EntityFrameworkCore;
using OpenSystem.Core.Application.Interfaces;

namespace OpenSystem.Core.Infrastructure.Persistence.Extensions
{
    public static class DbSetExtensions
    {
        /// <summary>
        /// Create a EntityStorage object for the <see cref="T:System.Data.Entity.DbSet`1"/> to have data persisted or removed from
        /// </summary>
        /// <typeparam name="TEntity">Source table type to be updated</typeparam>
        /// <param name="entity">DbSet to be updated</param>
        /// <param name="mapper">IMapper used to find TypeMap between classes</param>
        /// <returns>EntityStorage object to Update or Remove data</returns>
        public static EntityStorage<TEntity> EntityStorage<TEntity>(
            this DbSet<TEntity> entity,
            IMapper mapper
        )
            where TEntity : class => new EntityStorage<TEntity>(entity, mapper);
    }
}
