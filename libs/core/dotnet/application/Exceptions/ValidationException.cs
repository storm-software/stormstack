using FluentValidation.Results;
using System;
using System.Collections.Generic;

namespace OpenSystem.Core.DotNet.Application.Exceptions
{
    public class ValidationException : Exception
    {
        public ValidationException()
          : base("One or more validation failures have occurred.")
        {
            Errors = new List<string>();
        }

        public List<string> Errors { get; }

        public ValidationException(IEnumerable<ValidationFailure> failures)
          : this()
        {
            foreach (var failure in failures)
            {
                Errors.Add(failure.ErrorMessage);
            }
        }

        public ValidationException(string message)
          : base(message)
        {
          Errors = new List<string>();
          Errors.Add(message);
        }

        public ValidationException(string message, Exception innerException)
          : base(message, innerException)
        {
          Errors = new List<string>();
          Errors.Add(message);
        }
    }
}
