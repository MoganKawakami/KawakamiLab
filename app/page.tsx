import ImageScroller from "@/components/animations/ImageScroller";
import Image from "next/image";
import XTimeline from "@/components/XTimeline";
import ProfileCard from "@/components/ProfileCard";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <div className="flex flex-col gap-[32px] items-center sm:items-start w-full">
        <ImageScroller className="transform -translate-y-16 mx-auto" />

        {/* ProfileCardとXTimelineを横並びに配置 */}
        <div id="about" className="flex gap-8 self-start p-8 items-start w-full justify-between">
          {/* 左側: 縦書きの「about」 */}
          <div className="flex items-center justify-center">
            <h2
              className="text-6xl font-bold text-gray-700 transform rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              About
            </h2>
          </div>

          {/* 中央: ProfileCard（高さを800pxに合わせる） */}
          <div className="flex-shrink-0" style={{ height: "800px" }}>
            <ProfileCard
              name="川上モガん"
              description={`2003年5月生まれ 北海道出身\n2023年から進学のために愛知県へ\n同年からウマ娘のイラストを描き始める。2025年8月のコミックマーケット(C106)にて、初めて同人誌を作成する。\n 推しは「アグネスタキオン」「フジキセキ」「カツラギエース」「エアシャカール」「ジャングルポケット」\n\n\nBorn in May 2003 in Hokkaido. Moved to Aichi Prefecture in 2023 to attend school. Began drawing illustrations of Uma Musume in the same year. Created her first doujinshi at Comic Market (C106) in August 2025.\n My favorites are "Agnes Takion," "Fujikiseki," "Katsuragi Ace," "Air Shakur," and "Jungle Pocket."`}
              imageSrc="/images/sample1.jpg"
            />
          </div>

          {/* 右側: XTimeline - 右端に配置 */}
          <div className="flex-shrink-0 ml-auto">
            <h3 className="text-2xl font-bold mb-4">Kawakami Lab X Timeline</h3>
            <XTimeline username="Mogan_Kawakami" width="300" height="800" />
          </div>
        </div>
      </div>
    </div>
  );
}