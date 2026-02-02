import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import BlockchainView from "../components/BlockchainView";

export default function Dashboard() {
    return (
        <div className="layout">
            <Sidebar />
            <main className="center">
                <h2>Overview</h2>
                <BlockchainView />
            </main>
            <Profile />
        </div>
    );
}
