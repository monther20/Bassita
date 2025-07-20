import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputField({
  placeholder,
  type,
  name,
  value,
  onChange,
  className,
}: {
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} rounded-full`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-primary transition-colors"
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      )}
    </div>
  );
}
