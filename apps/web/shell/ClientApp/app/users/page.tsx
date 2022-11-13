import { useUser } from "@auth0/nextjs-auth0";

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        {user.picture && (
          <img src={user.picture} alt={user.name ?? "User Profile Image"} />
        )}
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}
