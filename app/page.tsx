import ImageScroller from "@/components/animations/ImageScroller";
import XTimeline from "@/components/XTimeline";
import ProfileCard from "@/components/ProfileCard";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "同人サークル[Kawakami Lab.]",
  description:
    "同人サークル[Kawakami Lab.], およびl, 川上モガんのポートフォリオサイト。最新の同人誌や作品紹介など。",
};

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-4 pb-12 sm:p-8 sm:pb-20 lg:p-20">
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-[32px] items-center sm:items-start w-full">
        <ImageScroller className="transform translate-y-2 sm:-translate-y-4 lg:-translate-y-18 mx-auto" />

        {/* ProfileCardとXTimelineを横並び（デスクトップ）または縦並び（モバイル）に配置 */}
        <div
          id="about"
          className="flex flex-col lg:flex-row gap-6 lg:gap-8 self-start p-4 sm:p-6 lg:p-8 items-start w-full lg:justify-between"
        >
          {/* 左側: 縦書きの「about」（モバイルでは横書きに変更） */}
          <div className="flex items-center justify-center lg:justify-start">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-700 lg:transform lg:rotate-180 lg:block">
              <span className="lg:hidden">About</span>
              <span
                className="hidden lg:inline"
                style={{ writingMode: "vertical-rl" }}
              >
                About
              </span>
            </h2>
          </div>

          {/* 中央: ProfileCard */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="lg:h-[800px]">
              <ProfileCard
                name="川上モガん"
                description={`2003年5月生まれ 北海道出身\n2023年から進学のために愛知県へ\n同年からウマ娘のイラストを描き始める。2025年8月のコミックマーケット(C106)にて、初めて同人誌を作成する。\n 推しは「アグネスタキオン」「フジキセキ」「カツラギエース」「エアシャカール」「ジャングルポケット」\n\n\nBorn in May 2003 in Hokkaido. Moved to Aichi Prefecture in 2023 to attend school. Began drawing illustrations of Uma Musume in the same year. Created her first doujinshi at Comic Market (C106) in August 2025.\n My favorites are "Agnes Takion," "Fujikiseki," "Katsuragi Ace," "Air Shakur," and "Jungle Pocket."`}
                imageSrc="/images/sample1.jpg"
              />
            </div>
          </div>

          {/* 右側: XTimeline */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:ml-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Kawakami Lab X Timeline
            </h3>
            <div className="w-full lg:w-auto">
              <XTimeline
                username="Mogan_Kawakami"
                height={600}
                className="w-full sm:!w-[300px] lg:!w-[350px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
