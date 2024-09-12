import "./index.css"


export default function Box({
    children,
    title,
    descripton
}: Readonly<{
    children: React.ReactNode;
    title: string;
    descripton: string;
}>) {

    return (
        <div className="modal-box">
            <div>
                <h3>{title}</h3>
                <span>
                    {descripton}
                </span>
            </div>
            <div className="modal-box-container">
                <div>
                </div>
                <div className="modal-box-actions">
                    <div>{children}
                    </div>
                </div>
            </div>
        </div>
    )
}