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
        /// Create a Persistence object for the <see cref="T:System.Data.Entity.DbSet`1"/> to have data persisted or removed from
        /// </summary>
        /// <typeparam name="TSource">Source table type to be updated</typeparam>
        /// <param name="source">DbSet to be updated</param>
        /// <param name="mapper">IMapper used to find TypeMap between classes</param>
        /// <returns>Persistence object to Update or Remove data</returns>
        public static IPersistence<TSource> Persist<TSource>(
            this DbSet<TSource> source,
            IMapper mapper
        )
            where TSource : class => new Persistence<TSource>(source, mapper);
    }
}
