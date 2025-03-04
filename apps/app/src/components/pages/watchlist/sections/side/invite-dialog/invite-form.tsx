"use client";

import { Button } from "@serea/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	useForm,
} from "@serea/ui/form";
import { Input } from "@serea/ui/input";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@serea/ui/select";
import { SearchIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

const inviteSchema = z.object({
	email: z.string().email(),
	role: z.enum(["VIEWER", "EDITOR"]),
});

export default function InviteForm({ watchlistId }: { watchlistId: string }) {
	const utils = api.useUtils();
	const invite = api.watchlist.inviteMembers.useMutation({
		onSuccess: () => {
			toast.success("Invite sent successfully");
			utils.watchlist.getInvites.invalidate();
		},
	});

	const form = useForm({
		schema: inviteSchema,
		defaultValues: {
			email: "",
			role: "VIEWER",
		},
	});

	const onSubmit = (data: z.infer<typeof inviteSchema>) => {
		invite.mutate({
			watchlistId: watchlistId,
			email: data.email,
			role: data.role,
		});
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, (error) => {
						console.log(error);
					})}
				>
					<div className="flex w-full items-center gap-2">
						<div className="relative w-full">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Input
												{...field}
												suffix={
													<FormField
														control={form.control}
														name="role"
														render={({ field: roleField }) => (
															<Select
																value={roleField.value}
																onValueChange={roleField.onChange}
																defaultValue={roleField.value}
															>
																<SelectTrigger className="ring-0 outline-none dark:shadow-none rounded-l-none w-[100px] -mx-3 h-8 dark:border-0 border-0 shadow-none focus:ring-0 focus:ring-offset-0 focus-within:ring-0">
																	<SelectValue placeholder="Select role" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="VIEWER">Viewer</SelectItem>
																	<SelectItem value="EDITOR">Editor</SelectItem>
																</SelectContent>
															</Select>
														)}
													/>
												}
												className="peer w-full ps-6"
												placeholder="Email"
												type="email"
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
								<SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
							</div>
						</div>
						<LoadingButton
							loading={invite.isPending}
							type="submit"
							after={<SendIcon />}
						>
							Send
						</LoadingButton>
					</div>
				</form>
			</Form>
		</div>
	);
}
