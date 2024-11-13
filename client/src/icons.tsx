import classes from "./icons.module.css";

import type { MouseEventHandler } from "react";

type icon = "close" | "dark-mode" | "light-mode" | "menu" | "visibility"
  | "visibility-off";

interface IconProps {
  name: icon;
  inactive?: boolean;
  className?: string;
}

interface IconButtonProps {
  name: icon;
  disabled?: boolean;
  className?: string;
  onClick?: MouseEventHandler;
}

export function Icon({ name, inactive = false, className = "" }: IconProps) {
  const iconClasses = [
    "material-symbols-outlined",
    inactive ? classes.iconInactive : classes.icon,
    classes[`icon-${name}`]
  ];
  return (
    <span className={`${iconClasses.join(" ")} ${className}`} />
  );
}

export function IconButton(props: IconButtonProps) {
  return (
    <button
      className={`${classes.iconButton} ${props.className ?? ""}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <Icon name={props.name} />
    </button>
  );
}
