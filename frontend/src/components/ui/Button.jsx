function Button({ children, variant = 'primary', type = 'button' }) {
    return (
        <button type={type} className={`btn btn--sm btn--${variant}`}>
            {children}
        </button>
    );
}

export default Button;
