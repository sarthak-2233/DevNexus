export default function Container({ className = "", children }) {
  return <div className={`mx-auto w-[min(1160px,calc(100%-40px))] ${className}`}>{children}</div>;
}
