import { useLayoutEffect } from "react";

import config from "../../app-config.json";

export function setTitle(title: string) {
  useLayoutEffect(() => {
    document.title = title + (title ? " | " : "") + config.name;
  });
}
