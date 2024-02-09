"use client";

import Image from "next/image";
import React from "react";

export const TalkingAvatar: React.FC = () => {
  return (
    <Image
      src="/images/avatar.png"
      alt="avatar"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  );
};
