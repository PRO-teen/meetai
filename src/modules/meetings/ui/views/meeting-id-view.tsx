"use client";
import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
// import { UpdateAgentDialog } from "@/modules/agents/ui/components/update-agent-dialog";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";


interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const[updateMeetingDialogOpen , setUpdateMeetingDialogOpen]=useState(false);

 const [RemoveConfirmation , confirmRemove] = useConfirm({
    title:"Are you sure?",
    description:"The following action will remove this meeting"
});

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess:() => {
         queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        router.push("/meetings");
      },
    }),
  );
// const handleRemoveMeeting = async () => {
//   const ok = await confirmRemove();
//   if (!ok) return;
//   await removeMeeting.mutateAsync({ id: meetingId });
// };
const handleRemoveMeeting = async () => {
  const ok = await confirmRemove();
  if (!ok) return;

  console.log("Confirmed delete for:", meetingId); // <-- ADD THIS

  try {
    await removeMeeting.mutateAsync({ id: meetingId });
    console.log("Delete mutation triggered");
  } catch (err) {
    console.error("Error in deletion:", err); // Catch backend errors
  }
};



  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
      open={updateMeetingDialogOpen}
      onOpenChange={setUpdateMeetingDialogOpen}
      initialValues={data}

      />
      <div className="flex-1 py-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {JSON.stringify(data, null, 2)}
      </div>
    </>
  );
};



export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error loading meeting"
      description="Something went wrong"
    />
  );
};
