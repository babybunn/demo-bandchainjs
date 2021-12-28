import AccountWithBalanceCenter from "./AccountWithBalanceCenter";
import SidebarAccountMenu from "./SidebarAccountMenu";

export default function AccountSidebar() {
  return (
    <div className="card bg-white rounded-2xl mt-5 lg:w-1/4 w-full">
      <AccountWithBalanceCenter />
      <SidebarAccountMenu />
    </div>
  );
}
