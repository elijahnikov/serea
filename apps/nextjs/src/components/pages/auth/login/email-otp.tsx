"use client";

import { authClient } from "@serea/auth/client";
import { Button } from "@serea/ui/button";
import Input from "@serea/ui/input";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@serea/ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import { redirect, useRouter } from "next/navigation";
import Loading from "@serea/ui/loading";

const formSchema = z.object({
	email: z.string().email(),
});

export default function EmailOtp() {
	const router = useRouter();

	const [hasSentOtp, setHasSentOtp] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const onComplete = async (token: string) => {
		setLoading(true);
		const user = await authClient.signIn.emailOtp({
			email: form.getValues("email"),
			otp: token,
		});
		if (user.data && !user.error) {
			router.push("/");
			setLoading(false);
		}
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setHasSentOtp(true);
		await authClient.emailOtp.sendVerificationOtp({
			email: data.email,
			type: "sign-in",
		});
	};

	if (hasSentOtp) {
		return (
			<div className="w-full p-1">
				{!loading ? (
					<InputOTP
						containerClassName="w-full items-center justify-center flex"
						maxLength={6}
						onComplete={onComplete}
					>
						<InputOTPGroup>
							<InputOTPSlot className="w-[62px] h-[62px]" index={0} />
							<InputOTPSlot className="w-[62px] h-[62px]" index={1} />
							<InputOTPSlot className="w-[62px] h-[62px]" index={2} />
							<InputOTPSlot className="w-[62px] h-[62px]" index={3} />
							<InputOTPSlot className="w-[62px] h-[62px]" index={4} />
							<InputOTPSlot className="w-[62px] h-[62px]" index={5} />
						</InputOTPGroup>
					</InputOTP>
				) : (
					<div className="flex items-center justify-center h-16">
						<Loading type="spinner" size="xs" />
					</div>
				)}
				<div className="flex items-center w-full justify-center mt-1">
					<p className="mt-1 text-neutral-500">Didn't receive the email?</p>
					<Button
						onClick={() => {
							setHasSentOtp(false);
							form.reset({ email: "" });
						}}
						variant={"link"}
					>
						Resend code
					</Button>
				</div>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form method="post" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										placeholder="Enter email address"
										{...field}
										autoCapitalize="false"
										autoCorrect="false"
										spellCheck="false"
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<Button className="w-full" variant={"outline"} type="submit">
						Continue
					</Button>
				</div>
			</form>
		</Form>
	);
}
