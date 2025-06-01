import { trpc } from "@/trpc/client";
import {
  MeetingGetOne,
  MeetingsInsertSchema,
  meetingsInsertSchema,
} from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const utils = trpc.useUtils();

  const [agentSearch, setAgentSearch] = useState("");
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

  const agents = trpc.agents.getMany.useQuery({
    page: 1,
    pageSize: 100,
    search: agentSearch,
  });

  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: (data) => {
      utils.meetings.getMany.invalidate();
      onSuccess?.(data.id);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMeeting = trpc.meetings.update.useMutation({
    onSuccess: () => {
      utils.meetings.getMany.invalidate();
      if (initialValues?.id) {
        utils.meetings.getOne.invalidate({ id: initialValues.id });
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<MeetingsInsertSchema>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name || "",
      agentId: initialValues?.agentId || "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (data: MeetingsInsertSchema) => {
    if (isEdit) {
      updateMeeting.mutate({
        ...data,
        id: initialValues.id,
      });
    } else {
      createMeeting.mutate(data);
    }
  };
  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={() => setOpenNewAgentDialog(false)}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Chat with NureAI" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={
                      agents.data?.items.map((agent) => ({
                        value: agent.id,
                        id: agent.id,
                        children: (
                          <div className="flex items-center gap-x-2">
                            <GeneratedAvatar
                              seed={agent.name}
                              className="size-8"
                              variant="botttsNeutral"
                            />
                            <span>{agent.name}</span>
                          </div>
                        ),
                      })) || []
                    }
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                    isSearchable
                  />
                </FormControl>
                <FormDescription>
                  Not found what you are looking for?{" "}
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create new agent
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                variant="ghost"
                type="button"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Updating" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
