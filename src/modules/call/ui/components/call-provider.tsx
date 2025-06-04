"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import { CallConnect } from "./call-connect";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {

    const {
        data: session,
        isPending,
        error,
    } = authClient.useSession()

    if (!session || isPending) {
        return (
            <div className="flex h-screen bg-radial from-pink-400 to-teal-600 justify-center items-center">
                <Loader2Icon className="animate-spin size-6 text-white" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen bg-radial from-pink-400 to-teal-600 justify-center items-center">
                <Loader2Icon className="animate-spin size-6 text-white" />
                <p className="text-white">Something went wrong</p>
            </div>
        )
    }

  return (
    <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={session.user.id}
        userImage={session.user.image ?? 
            generateAvatarUri({ seed: session.user.id, variant: "initials" })
        }
        userName={session.user.name}
    />
  );
};
