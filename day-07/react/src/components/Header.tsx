export default function Header() {
  const userName: string = 'Nour';
  const userInitial: string = userName.charAt(0).toUpperCase();

  return (
    <header className="main-header">
      <div className="header-title">
        <h1>TaskFlow</h1>
      </div>
      <div className="user-avatar" title={userName}>
        {userInitial}
      </div>
    </header>
  );
}