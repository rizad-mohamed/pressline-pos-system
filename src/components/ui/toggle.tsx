"use client";

import { cva } from "class-variance-authority";

const toggleVariants = cva("choice", {
  variants: {
    variant: {
      default: "choice-default",
      outline: "choice-outline",
    },
    size: {
      default: "choice-normal",
      sm: "choice-small",
      lg: "choice-large",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export { toggleVariants };
