export default function BlockchainView() {
    const blocks = [
        { id: 1, hash: "0xA1F3...", data: "Course Completed" },
        { id: 2, hash: "0xB9C2...", data: "Grade Stored" },
        { id: 3, hash: "0xC7D8...", data: "Certificate Minted" },
    ];

    return (
        <div className="blockchain">
            <h3>Blockchain</h3>

            <div className="blocks">
                {blocks.map((block) => (
                    <div key={block.id} className="block">
                        <p><strong>Block #{block.id}</strong></p>
                        <p>{block.hash}</p>
                        <span>{block.data}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
