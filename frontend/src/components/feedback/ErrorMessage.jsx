function ErrorMessage({ message, onRetry }) {
    return (
        <div
            style={{
                background: '#ffebee',
                color: '#93000a',
                border: '1px solid rgba(186,26,26,0.25)',
                borderRadius: '8px',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
            }}
        >
            <span>{message}</span>
            {onRetry ? (
                <button
                    type="button"
                    onClick={onRetry}
                    style={{
                        border: 'none',
                        background: '#93000a',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontWeight: 700,
                    }}
                >
                    Retry
                </button>
            ) : null}
        </div>
    );
}

export default ErrorMessage;
