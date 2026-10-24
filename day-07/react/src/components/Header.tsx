import {  APP_TAGLINE, getAppName } from "../constants";

interface HeaderProps {
  userName: string;
}

function Header({ userName }: HeaderProps) {
  return (
    <>
      <header className="app-header">
        <div className="logo">{getAppName()}</div>
        <p className="tagline">hi, {userName}!  {APP_TAGLINE}</p>
      </header>
    </>
  );
}

export default Header;