import { InputHTMLAttributes } from "react";

export const Input = ({
  name,
  label,
  ...inputAttrs
}: {
  name: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <>
      <label htmlFor={name}>{label || name}:</label>
      <input id={name} name={name} {...inputAttrs} />
    </>
  );
};
