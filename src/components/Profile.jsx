export default function Profile() {
    return (
        <aside className="profile">
            <img
                src="https://via.placeholder.com/80"
                alt="User"
                className="avatar"
            />
            <h4>Student Name</h4>
            <p>Blockchain Student</p>

            <div className="reminder">
                <strong>Next Lecture</strong>
                <p>10:00 – 12:00</p>
            </div>
        </aside>
    );
}
