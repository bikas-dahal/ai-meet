import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  onJoin: () => void;
}

export const CallLobby = ({ onJoin }: Props) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserPermission = hasMicPermission && hasCameraPermission;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-radial from-pink-400 to-teal-600">
      <div className="flex flex-1 py-4 px-4 md:px-8 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 p-10 shadow-sm bg-background rounded-lg">
          <div className="flex flex-col gap-y-2 text-center">
            <h5 className="text-xl font-medium">Ready to join?</h5>
            <p className="text-muted-foreground text-sm">
              Setup your camera and microphone before joining the call
            </p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserPermission
                ? DisabledVideoPreview
                : AllowBrowserPermission
            }
          />
          <div className="flex items-center gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex items-center justify-between gap-x-2 w-full">
            <Button asChild variant={"ghost"}>
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogInIcon />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DisabledVideoPreview = () => {
  const { data: session } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: session?.user.name ?? "",
          image:
            session?.user.image ??
            generateAvatarUri({
              seed: session?.user.id ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermission = () => {
  return (
    <div className="text-sm text-center">
      Please grant camera and microphone permission to join the call
    </div>
  );
};
