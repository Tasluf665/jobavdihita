function AccountabilityNote({ message }) {
    return (
        <div className="accountability-note">
            <p className="accountability-note__content">
                ACCOUNTABILITY NOTE:
                <span className="accountability-note__text">{message}</span>
            </p>
        </div>
    );
}

export default AccountabilityNote;
