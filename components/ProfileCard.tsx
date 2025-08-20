"use client";

import Image from "next/image";

interface ProfileCardProps {
  name: string;
  description: string;
  imageSrc: string;
}

export default function ProfileCard({
  name,
  description,
  imageSrc,
}: ProfileCardProps) {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-2xl flex flex-col items-center p-12 gap-8 h-full min-h-[800px]">
      {/* 上側：画像 */}
      <div className="w-48 h-48 relative flex-shrink-0">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="rounded-full object-cover border-4 border-gray-300"
        />
      </div>

      {/* 下側：説明 */}
      <div className="flex-1 text-center">
        <h2 className="text-4xl font-bold mb-6">{name}</h2>
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line text-left">
          {description}
        </p>
      </div>
    </div>
  );
}
