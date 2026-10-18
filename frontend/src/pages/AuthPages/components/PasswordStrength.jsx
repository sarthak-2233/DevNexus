import { passwordScore } from "../validators";

const colors = ["#ff8a7a", "#e08a6b", "#d9b878", "#8fd6b0"];
const labels = ["Too weak", "Weak", "Good", "Strong"];

export default function PasswordStrength({ password }) {
  const s = passwordScore(password);
  return (
    <div className="-mt-1.5 mb-4">
      <div className="grid grid-cols-4 gap-[5px]">
        {colors.map((c, i) => (
          <i key={c} className="h-1 rounded bg-line transition-colors duration-300" style={i < s ? { background: colors[s - 1] } : undefined} />
        ))}
      </div>
      <p className="mt-1.5 text-[.78rem] text-muted">{s ? labels[s - 1] : "Use 8+ characters with numbers and symbols."}</p>
    </div>
  );
}
