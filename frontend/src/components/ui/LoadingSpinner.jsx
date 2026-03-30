function LoadingSpinner({ label = 'Loading...' }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
            <span
                style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(71,85,105,0.2)',
                    borderTopColor: '#2563eb',
                    borderRadius: '999px',
                    animation: 'spin 0.7s linear infinite',
                }}
            />
            <span>{label}</span>
        </div>
    );
}

export default LoadingSpinner;
