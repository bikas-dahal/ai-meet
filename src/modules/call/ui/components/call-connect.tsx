import { trpc } from "@/trpc/client";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userImage: string;
  userName: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userImage,
  userName,
}: Props) => {
  const { mutateAsync: generateToken } =
    trpc.meetings.generateToken.useMutation();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });

    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(null);
    };
  }, [generateToken, userId, userImage, userName]);

  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
        if (_call.state.callingState !== CallingState.LEFT) {
            _call.leave();
            _call.endCall();
            setCall(null);
        }
    }
  }, [client, meetingId]);

  if (!call || !client) {
    return (
        <div className="flex h-screen bg-radial from-pink-400 to-teal-600 justify-center items-center">
            <Loader2Icon className="animate-spin size-6 text-white" />
        </div>
    )
  }

  return (
    <StreamVideo client={client}>
        <StreamCall call={call}>
            <CallUI meetingName={meetingName} />
        </StreamCall>
    </StreamVideo>
  );
};
