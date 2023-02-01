using OpenSystem.User.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenSystem.User.Application.Interfaces;
using OpenSystem.User.Application.Queries.GetUsers;

namespace OpenSystem.User.Infrastructure.Services
{
    public class UserStore : IUserStore<UserEntity>,
      IUserPasswordStore<UserEntity>,
      IUserSecurityStampStore<UserEntity>,
      IUserEmailStore<UserEntity>,
      IUserPhoneNumberStore<UserEntity>,
      IUserTwoFactorStore<UserEntity>,
      IUserLockoutStore<UserEntity>,
      IUserAuthenticationTokenStore<UserEntity>,
      IUserAuthenticatorKeyStore<UserEntity>,
      IUserTwoFactorRecoveryCodeStore<UserEntity>
    {
        private readonly IUserRepository _userRepository;

        public UserStore(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public void Dispose()
        {
        }

        public async Task<IdentityResult> CreateAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            await _userRepository.AddAsync(user);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            await _userRepository.DeleteAsync(user);
            return IdentityResult.Success;
        }

        public async Task<UserEntity> FindByEmailAsync(string normalizedEmail,
          CancellationToken cancellationToken)
        {
            return (await _userRepository.GetUsersAsync(
                new GetUsersQuery { Email = normalizedEmail }))
              .data
              ?.FirstOrDefault();
        }

        public async Task<UserEntity> FindByIdAsync(string userId,
          CancellationToken cancellationToken)
        {
          return await _userRepository.GetByIdAsync(Guid.Parse(userId));
        }

        public async Task<UserEntity> FindByNameAsync(string normalizedUserName,
          CancellationToken cancellationToken)
        {
            return (await _userRepository.GetUsersAsync(
                new GetUsersQuery { UserName = normalizedUserName }))
              .data
              ?.FirstOrDefault();
        }

        public Task<int> GetAccessFailedCountAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task<string> GetEmailAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task<bool> GetLockoutEnabledAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.LockoutEnabled);
        }

        public Task<DateTimeOffset?> GetLockoutEndDateAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.LockoutEnd);
        }

        public Task<string> GetNormalizedEmailAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedEmail);
        }

        public Task<string> GetNormalizedUserNameAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetPasswordHashAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<string> GetPhoneNumberAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumber);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        public Task<string> GetSecurityStampAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.SecurityStamp ?? string.Empty);
        }

        public Task<bool> GetTwoFactorEnabledAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task<string> GetUserIdAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }

        public Task<string> GetUserNameAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task<bool> HasPasswordAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public Task<int> IncrementAccessFailedCountAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            user.AccessFailedCount++;
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task ResetAccessFailedCountAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            user.AccessFailedCount = 0;
            return Task.CompletedTask;
        }

        public Task SetEmailAsync(UserEntity user,
          string email,
          CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.CompletedTask;
        }

        public Task SetEmailConfirmedAsync(UserEntity user,
          bool confirmed,
          CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public Task SetLockoutEnabledAsync(UserEntity user,
          bool enabled,
          CancellationToken cancellationToken)
        {
            user.LockoutEnabled = enabled;
            return Task.CompletedTask;
        }

        public Task SetLockoutEndDateAsync(UserEntity user,
          DateTimeOffset? lockoutEnd,
          CancellationToken cancellationToken)
        {
            user.LockoutEnd = lockoutEnd;
            return Task.CompletedTask;
        }

        public Task SetNormalizedEmailAsync(UserEntity user,
          string normalizedEmail,
          CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.CompletedTask;
        }

        public Task SetNormalizedUserNameAsync(UserEntity user,
          string normalizedName,
          CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.CompletedTask;
        }

        public Task SetPasswordHashAsync(UserEntity user,
          string passwordHash,
          CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.CompletedTask;
        }

        public Task SetPhoneNumberAsync(UserEntity user,
          string phoneNumber,
          CancellationToken cancellationToken)
        {
            user.PhoneNumber = phoneNumber;
            return Task.CompletedTask;
        }

        public Task SetPhoneNumberConfirmedAsync(UserEntity user,
          bool confirmed,
          CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public Task SetSecurityStampAsync(UserEntity user,
          string stamp,
          CancellationToken cancellationToken)
        {
            user.SecurityStamp = stamp;
            return Task.CompletedTask;
        }

        public Task SetTwoFactorEnabledAsync(UserEntity user,
          bool enabled,
          CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled = enabled;
            return Task.CompletedTask;
        }

        public Task SetUserNameAsync(UserEntity user,
          string userName,
          CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public async Task<IdentityResult> UpdateAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            await _userRepository.UpdateAsync(user);
            return IdentityResult.Success;
        }

        private const string AuthenticatorStoreLoginProvider = "[AuthenticatorStore]";
        private const string AuthenticatorKeyTokenName = "AuthenticatorKey";
        private const string RecoveryCodeTokenName = "RecoveryCodes";

        public Task<string> GetTokenAsync(UserEntity user,
          string loginProvider,
          string name,
          CancellationToken cancellationToken)
        {
            var tokenEntity = user.Tokens.SingleOrDefault(
                    l => l.TokenName == name &&
                    l.LoginProvider == loginProvider);
            return Task.FromResult(tokenEntity?.TokenValue);
        }

        public async Task SetTokenAsync(UserEntity user,
          string loginProvider,
          string name,
          string value,
          CancellationToken cancellationToken)
        {
            var tokenEntity = user.Tokens.SingleOrDefault(token => token.TokenName == name &&
              token.LoginProvider == loginProvider);
            if (tokenEntity != null)
            {
                tokenEntity.TokenValue = value;
            }
            else
            {
                user.Tokens.Add(new UserToken
                {
                    UserId = user.Id,
                    LoginProvider = loginProvider,
                    TokenName = name,
                    TokenValue = value,
                });
            }
        }

        public async Task RemoveTokenAsync(UserEntity user,
          string loginProvider,
          string name,
          CancellationToken cancellationToken)
        {
            var tokenEntity = user.Tokens.SingleOrDefault(
                    l => l.TokenName == name && l.LoginProvider == loginProvider);
            if (tokenEntity != null)
            {
                user.Tokens.Remove(tokenEntity);
            }
        }

        public Task SetAuthenticatorKeyAsync(UserEntity user,
          string key,
          CancellationToken cancellationToken)
        {
            return SetTokenAsync(user,
              AuthenticatorStoreLoginProvider,
              AuthenticatorKeyTokenName,
              key,
              cancellationToken);
        }

        public Task<string> GetAuthenticatorKeyAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            return GetTokenAsync(user,
              AuthenticatorStoreLoginProvider,
              AuthenticatorKeyTokenName,
              cancellationToken);
        }

        public Task ReplaceCodesAsync(UserEntity user,
          IEnumerable<string> recoveryCodes,
          CancellationToken cancellationToken)
        {
            var mergedCodes = string.Join(";",
              recoveryCodes);
            return SetTokenAsync(user,
              AuthenticatorStoreLoginProvider,
              RecoveryCodeTokenName,
              mergedCodes,
              cancellationToken);
        }

        public async Task<bool> RedeemCodeAsync(UserEntity user,
          string code,
          CancellationToken cancellationToken)
        {
            var mergedCodes = await GetTokenAsync(user,
              AuthenticatorStoreLoginProvider,
              RecoveryCodeTokenName,
              cancellationToken) ?? "";
            var splitCodes = mergedCodes.Split(';');
            if (splitCodes.Contains(code))
            {
                var updatedCodes = new List<string>(splitCodes.Where(s => s != code));
                await ReplaceCodesAsync(user,
                  updatedCodes,
                  cancellationToken);

                return true;
            }

            return false;
        }

        public async Task<int> CountCodesAsync(UserEntity user,
          CancellationToken cancellationToken)
        {
            var mergedCodes = await GetTokenAsync(user,
              AuthenticatorStoreLoginProvider,
              RecoveryCodeTokenName,
              cancellationToken) ?? "";
            if (mergedCodes.Length > 0)
            {
                return mergedCodes.Split(';').Length;
            }

            return 0;
        }
    }
}
