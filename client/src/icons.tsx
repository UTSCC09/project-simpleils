import classes from "./icons.module.css";

import type { ComponentProps } from "react";

export type icon = "close" | "dark-mode" | "light-mode" | "menu" | "visibility"
  | "visibility-off";

export interface IconProps {
  name: icon;
  inactive?: boolean;
  className?: string;
}

export interface IconButtonProps {
  name: icon;
  className?: string;
}

export function Icon({ name, inactive = false, className = "", ...rest }:
  IconProps & ComponentProps<"span">) {
  const iconClasses = [
    "material-symbols-outlined",
    inactive ? classes.iconInactive : classes.icon,
    classes[`icon-${name}`]
  ];
  return (
    <span className={`${iconClasses.join(" ")} ${className}`} {...rest} />
  );
}

export function IconButton({ name, className, ...rest }:
  IconButtonProps & ComponentProps<"button">) {
  return (
    <button
      className={`${classes.iconButton} ${className ?? ""}`}
      {...rest}
    >
      <Icon name={name} />
    </button>
  );
}
