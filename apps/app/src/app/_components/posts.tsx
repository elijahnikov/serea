"use client";

import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	useForm,
} from "@serea/ui/form";
import { Input } from "@serea/ui/input";
import { z } from "zod";

import { api } from "~/trpc/react";

export function CreatePostForm() {
	const form = useForm({
		schema: z.object({
			name: z.string(),
		}),
		defaultValues: {
			name: "",
		},
	});

	const utils = api.useUtils();
	const createPost = api.post.create.useMutation({
		onSuccess: async () => {
			form.reset();
			await utils.post.invalidate();
		},
	});

	return (
		<Form {...form}>
			<form
				className="flex w-full max-w-2xl flex-col gap-4"
				onSubmit={form.handleSubmit((data) => {
					createPost.mutate({ name: data.name });
				})}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder="Title" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button variant={"secondary"}>Create</Button>
			</form>
		</Form>
	);
}

export function PostList() {
	const [posts] = api.post.all.useSuspenseQuery();

	if (posts.length === 0) {
		return (
			<div className="relative flex w-full flex-col gap-4">
				<PostCardSkeleton pulse={false} />
				<PostCardSkeleton pulse={false} />
				<PostCardSkeleton pulse={false} />

				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
					<p className="text-2xl font-bold text-white">No posts yet</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			{posts.map((p) => {
				return <PostCard key={p.id} post={p} />;
			})}
		</div>
	);
}

export function PostCard(props: {
	post: RouterOutputs["post"]["all"][number];
}) {
	const utils = api.useUtils();
	const deletePost = api.post.delete.useMutation({
		onSuccess: async () => {
			await utils.post.invalidate();
		},
	});

	return (
		<div className="flex flex-row rounded-lg bg-muted p-4">
			<div className="flex-grow">
				<h2 className="text-2xl font-bold text-primary">{props.post.title}</h2>
			</div>
			<div>
				<Button
					variant="ghost"
					className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
					onClick={() => deletePost.mutate(props.post.id)}
				>
					Delete
				</Button>
			</div>
		</div>
	);
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
	const { pulse = true } = props;
	return (
		<div className="flex flex-row rounded-lg bg-muted p-4">
			<div className="flex-grow">
				<h2
					className={cn(
						"w-1/4 rounded bg-primary text-2xl font-bold",
						pulse && "animate-pulse",
					)}
				>
					&nbsp;
				</h2>
				<p
					className={cn(
						"mt-2 w-1/3 rounded bg-current text-sm",
						pulse && "animate-pulse",
					)}
				>
					&nbsp;
				</p>
			</div>
		</div>
	);
}
