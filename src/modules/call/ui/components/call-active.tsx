import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";

interface Props {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="bg-[#1e1e1e] p-4 rounded-full flex items-center gap-3">
        <Link
          href={"/"}
          className="flex items-center justify-center p-1 bg-white/20 w-fit rounded-full"
        >
          <Image src={"/logo.svg"} alt="logo" width={24} height={24} />
        </Link>
        <h4 className="text-lg font-semibold">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="bg-[#1e1e1e] p-4 rounded-full flex items-center gap-3">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
