import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpenIcon,
  ClockFading,
  FileTextIcon,
  FileVideoIcon,
  Sparkle,
} from "lucide-react";
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import Markdown from "react-markdown";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="bg-white rounded-lg border px-3 py-2">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                border-b-2 border-transparent hover:text-accent-foreground"
              >
                <BookOpenIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                border-b-2 border-transparent hover:text-accent-foreground"
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recordings"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                border-b-2 border-transparent hover:text-accent-foreground"
              >
                <FileVideoIcon />
                Recordings
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none
                border-b-2 border-transparent hover:text-accent-foreground"
              >
                <Sparkle />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="recordings">
          <div className="bg-white rounded-lg border px-4 py-5">
            <video
              src={data.recordingUrl!}
              className="w-full rounded-lg"
              controls
            />
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex gap-x-2 items-center underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
              </div>
              <div className="flex items-center gap-x-2">
                <Sparkle className="size-4" />
                <p>General Summary</p>
              </div>
              <Badge
                variant="outline"
                className="flex items-center gap-x-2 [&>svg]:size-4"
              >
                <ClockFading />
                {data.duration && formatDuration(data.duration)}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 {...props} className="text-2xl font-medium" />
                    ),
                    h2: (props) => (
                      <h2 {...props} className="text-xl font-medium" />
                    ),
                    h3: (props) => (
                      <h3 {...props} className="text-lg font-medium" />
                    ),
                    h4: (props) => (
                      <h4 {...props} className="text-md font-medium" />
                    ),
                    h5: (props) => (
                      <h5 {...props} className="text-sm font-medium" />
                    ),
                    h6: (props) => (
                      <h6 {...props} className="text-xs font-medium" />
                    ),
                    p: (props) => <p {...props} className="text-sm" />,
                    a: (props) => <a {...props} className="text-blue-500" />,
                    strong: (props) => (
                      <strong {...props} className="font-bold" />
                    ),
                    em: (props) => <em {...props} className="italic" />,
                    code: (props) => (
                      <code {...props} className="bg-gray-100 px-1 rounded" />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        {...props}
                        className="border-l-2 border-gray-200 pl-4"
                      />
                    ),
                    ul: (props) => <ul {...props} className="list-disc pl-4" />,
                    ol: (props) => (
                      <ol {...props} className="list-decimal pl-4" />
                    ),
                    li: (props) => <li {...props} className="mb-2" />,
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
