import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

// import { useRouter } from "next/navigation";
import { useQueryClient ,useMutation  ,useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Form , FormControl ,FormField,FormItem,FormLabel,FormMessage ,FormDescription } from "@/components/ui/form";
import { MeetingGetOne } from "../../types";
import { meetingsInsertSchema } from "../../schemas";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";




interface MeetingFormProps {
  onSuccess?: (id?:string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setOpenNewAgentDaialog] = useState(false);
const [agentSearch, setAgentSearch] = useState("");

const agents = useQuery(
    trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search: agentSearch,
    }),
);


  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
        onSuccess: async(data)=>{
          await  queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({}),
            );
            
            onSuccess?.(data.id);
        },
        onError:(error)=>{
            toast.error(error.message);
        },
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
        onSuccess: async()=>{
          await  queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({}),
            );
            if(initialValues?.id){
               await  queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({id:initialValues.id}),
                );
            }
            onSuccess?.();
        },
        onError:(error)=>{
            toast.error(error.message);
        },
    }),
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
  resolver: zodResolver(meetingsInsertSchema),
  defaultValues: {
    name: initialValues?.name ?? "",
    agentId: initialValues?.agentId ?? "",
  },
});

const isEdit = !!initialValues?.id;
const isPending = createMeeting.isPending || updateMeeting.isPending; 

const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
  if (isEdit) {
    updateMeeting.mutate({...values , id:initialValues.id});
  }else{
    createMeeting.mutate(values);
  }
};

return(
  <>
  <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDaialog}/>
    <Form {...form}>
  <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      name="name"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="e.g. Maths Consultations" />
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />

     <FormField
      name="agentId"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <CommandSelect
    options={(agents.data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar
                    seed={agent.name}
                    variant="botttsNeutral"
                    className="border size-6"
                />
                <span>{agent.name}</span>
            </div>
        )
    }))}
    onSelect={field.onChange}
    onSearch={setAgentSearch}
    value={field.value}
    placeholder="select an agent"

/>
          </FormControl>
          <FormDescription>
            Not found what you&apos;re looking for?{" "}
            <button
            type="button"
            className="text-primary hover:underline"
            onClick={()=>setOpenNewAgentDaialog(true)}
            >
              Create new agent
            </button>
          </FormDescription>
          <FormMessage/>
        </FormItem>
      )}
    />

    
    <div className="flex justify-between gap-x-2">
    {onCancel && (
  <Button
    variant="ghost"
    disabled={isPending}
    type="button"
    onClick={() => onCancel?.()}
  >
    Cancel
  </Button>
)}

<Button disabled={isPending} type="submit">
  {isEdit ? "Update" : "Create"}
</Button>
</div>


  </form>
</Form>
</>

)


};
