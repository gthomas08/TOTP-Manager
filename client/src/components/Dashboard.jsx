import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { adminInfo } = useAuth();

  return (
    <>
      <div>This is the dashboard</div>
      <div>The jwt is: {`${adminInfo?.token}`}</div>
    </>
  );
};

export default Dashboard;
