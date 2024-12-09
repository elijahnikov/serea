"use client";

import { Button } from "@serea/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@serea/ui/dialog";
import { LoadingButton } from "@serea/ui/loading-button";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

interface ConfirmDialogProps {
	message: string;
	title: string;
	onConfirm: () => void;
	onCancel?: () => void;
	loading?: boolean;
}

interface ConfirmContextType {
	confirm: (props: ConfirmDialogProps) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
	const context = useContext(ConfirmContext);
	if (!context) {
		throw new Error("useConfirm must be used within a ConfirmDialogProvider");
	}
	return context;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [dialogState, setDialogState] = useState<ConfirmDialogProps | null>(
		null,
	);

	const confirm = useCallback((props: ConfirmDialogProps) => {
		setDialogState(props);
	}, []);

	const handleConfirm = () => {
		if (dialogState) {
			dialogState.onConfirm();
			setDialogState(null);
		}
	};

	const handleCancel = () => {
		if (dialogState) {
			dialogState.onCancel?.();
			setDialogState(null);
		}
	};

	return (
		<ConfirmContext.Provider value={{ confirm }}>
			{children}
			<Dialog open={!!dialogState} onOpenChange={() => setDialogState(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{dialogState?.title}</DialogTitle>
						<DialogDescription>{dialogState?.message}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<LoadingButton
							spinnerSize="xs"
							loading={dialogState?.loading}
							onClick={handleConfirm}
						>
							Confirm
						</LoadingButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</ConfirmContext.Provider>
	);
};
