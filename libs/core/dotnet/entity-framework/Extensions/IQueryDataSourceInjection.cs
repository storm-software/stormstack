using System;
using System.Collections;
using AutoMapper.Extensions.ExpressionMapping.Impl;

namespace OpenSystem.Core.EntityFramework.Extensions
{
    public static class IQueryDataSourceInjection
    {
        /// <summary>
        /// Non Generic call for For
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <param name="source"></param>
        /// <param name="destType"></param>
        /// <returns></returns>
        public static IEnumerable For<TSource>(
            this IQueryDataSourceInjection<TSource> source,
            Type destType
        )
        {
            var forMethod = source.GetType().GetMethod("For").MakeGenericMethod(destType);
            var listType = typeof(List<>).MakeGenericType(destType);
            var forResult = forMethod.Invoke(source, new object[] { null });
            var enumeratedResult = Activator.CreateInstance(listType, forResult);
            return enumeratedResult as IEnumerable;
        }
    }
}
