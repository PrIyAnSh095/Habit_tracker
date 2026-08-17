function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <p>{message || "Something went wrong."}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
