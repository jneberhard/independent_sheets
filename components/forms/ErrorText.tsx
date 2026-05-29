"use client";

import React from "react";

type Props = {
  field: string;
  errors: Record<string, string>;
};

export default function ErrorText({ field, errors }: Props) {
  if (!errors[field]) return null;

  return (
    <p className="text-sm text-red-600 mt-1">
      {errors[field]}
    </p>
  );
}