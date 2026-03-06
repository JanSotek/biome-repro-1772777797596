// @ts-nocheck
/** biome-ignore-all lint/suspicious/noExplicitAny: repro file with mocked imports */
/* biome-ignore-all lint/correctness/noUndeclaredDependencies: repro file with mocked imports */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useShallow } from 'zustand/shallow';

import { useI18n } from '@/x/y';

import useToastHook from '../mocks/useA';
import { useParamsHook } from '../mocks/useB';
import useDataHook from '../mocks/useC';
import useConnHook, { SWITCHED_SESSION_CODE as SWITCHED_ITEM_CODE } from '../mocks/useD';
import { openConsentDialog as openApprovalDialog } from '../mocks/useE';
import useStoreHook from '../mocks/useF';
import { isDebugMode } from '../mocks/useG';
import { pushUrlArgs } from '../mocks/useH';
import { closeConnSocket } from './apiMock';
import { createReturnUrl } from './helpersMock';
import { sendPayload } from './inputUtilsMock';
import useRestoreHook, {
	CONSENT_STORAGE_KEY as APPROVAL_STORAGE_KEY,
} from './useRestoreMock';

import type { SessionMessageType as DataMessageType } from '../types/a';
import type { IEmbedParams as IPanelParams } from '../types/b';
import type { IQueries as IOptions } from '../types/c';
import type { HandleError, HandleErrorOption, NewSession as NewItem } from '../types/d';
import type { InputDataMap } from './types/e';
import type { InputTypes, SendInputMessage } from './types/f';

interface IProps {
	x0?: boolean;
}

interface IPropsOutput {
	x1: boolean;
	x2: boolean;
	x3: DataMessageType[];
	x4: DataMessageType[];
	x5: string | null;
	x6: string | null;
	x7: IOptions[] | null;
	x8: boolean;
	x9: SendInputMessage;
	x10: NewItem;
	x11: HandleError;
}

export default function x12({ x0 = false }: IProps): IPropsOutput {
	const { sharedId: x13, publicId: x14, query: x15 } = useParamsHook();

	const [x16, x17] = useState<DataMessageType[]>([]);
	const [x18, x19] = useState<DataMessageType[]>([]);
	const [x20, x21] = useState<string | null>(null);
	const [x22, x23] = useState<string | null>(null);

	const [x24, x25] = useState<boolean>(false);
	const [x26, x27] = useState<boolean>(false);
	const [x28, x29] = useState<boolean>(false);

	const { x30, x31, x32, x33, x34, x35, x36, x37, x38, x39 } = useStoreHook(
		useShallow((x40: any) => ({
			x30: x40.panelParamsSlice.panelParams,
			x31: x40.panelSlice.isPanelOpen,
			x32: x40.approvalStateSlice.scriptLoadError,
			x33: x40.usageLimitSlice.setLimitNotice,
			x34: x40.inputSlice.setInputValue,
			x35: x40.userApprovalSlice.isUserVerified,
			x36: x40.userApprovalSlice.pendingInput,
			x37: x40.userApprovalSlice.setPendingInput,
			x38: x40.userApprovalSlice.setAllowInfoPage,
			x39: x40.approvalStateSlice.approvalState,
		})),
	);

	const x41 = useRef<string | null>(null);
	const x42 = useRef<string | null>(x15);
	const x43 = useRef<boolean>(false);

	const x44 = useI18n();
	const { showFiniteToast: x45 } = useToastHook();
	const {
		setError: x46,
		resetError: x47,
		isError: x48,
	} = useStoreHook((x49: any) => x49.errorSlice);

	const x50: HandleError = useCallback(
		(x51: HandleErrorOption) => {
			if (x43.current) {
				return;
			}

			x27(false);
			x25(false);

			if (x51.type === 'critical') {
				x46(x51.data.errorCode, x51.data.traceId, x51.isAdblock);
			}

			if (x51.type === 'recoverable') {
				x45(x51.message, x51.message);
			}

			x43.current = true;
			x56();
		},
		[x46, x45],
	);

	const { configData: x52, loadFreshData: x53, loadSharedData: x54 } = useDataHook(x50);

	const x55 = useMemo(() => {
		if (x28) {
			return [];
		}

		if (x52?.options?.length) {
			return x52.options;
		}

		return null;
	}, [x28, x52?.options]);

	const x57 = useMemo(
		() => ({
			onMessagesChange: x17,
			onChildMessagesChange: x19,
			onLoadingChange: x25,
			onReadyChange: (x58: boolean) => {
				x27(x58);
				if (x58) {
					x43.current = false;
				}
			},
			handleError: x50,
		}),
		[x50],
	);

	const {
		wsRef: x59,
		closeConnection: x56,
		resetReconnectAvailability: x60,
	} = useConnHook({
		configData: x52,
		callbacks: x57,
	});

	useEffect(() => {
		if (x32 && !x48) {
			x43.current = false;
			x50({
				type: 'critical',
				data: { errorCode: 'default_error' },
				isAdblock: true,
			});
		}
	}, [x32, x48, x50]);

	const x61 = useCallback(() => {
		x17([]);
		x19([]);

		if (!isDebugMode()) {
			x27(false);
		}

		x25(false);
		x47();
		x60();
		x33(null);
		x34('');
		x37(null);
	}, [x33, x60, x34, x47, x37]);

	const x62 = useCallback(
		<T extends InputTypes>(x63: T, x64: InputDataMap[T]) => {
			if (x16.length === 0 && x52) {
				x21(x52.session);

				if (!x0) {
					pushUrlArgs({ session: x52.session }, x52.sessionKey);
				}
			}

			if (!x24 || x63 === 'stop' || x63 === 'call') {
				sendPayload(x59.current, x63, x64);
			}

			if (x63 === 'stop') {
				x25(false);
			}
		},
		[x52, x16, x24, x59, x0],
	);

	useEffect(() => {
		if (x26 && x36) {
			x37(null);
			x62('user', { ...x36 });
		}
	}, [x26, x36, x37, x62]);

	const x65 = useCallback(
		<T extends InputTypes>(x66: T, x67: InputDataMap[T]) => {
			if (x66 === 'user' && x39 === false) {
				if (x0) {
					openApprovalDialog(window.location.href);
				} else {
					try {
						window.sessionStorage.setItem(APPROVAL_STORAGE_KEY, JSON.stringify(x67));
						openApprovalDialog(createReturnUrl(APPROVAL_STORAGE_KEY));
					} catch {
						openApprovalDialog(window.location.href);
					}
				}

				return;
			}

			if (x26 && !x48) {
				x62(x66, x67);
				return;
			}

			if (x48) {
				return;
			}

			if (x35 === false && x66 === 'user' && !!x39) {
				const x68 = x67 as InputDataMap['user'];
				x37(x68);
				x38(true);
				return;
			}

			x45('not-ready-toast', x44('NOT_READY'));
		},
		[x26, x48, x62, x44, x35, x37, x38, x45, x39, x0],
	);

	useRestoreHook({
		approvalState: x39,
		isReady: x26,
		isUserVerified: x35,
		isPanelMode: x0,
		sendInput: x65,
	});

	const x69 = useCallback(
		async (
			x70: string | null = null,
			x71: IPanelParams | null = null,
			x72: string | null = null,
		) => {
			if (x0 && !x71) {
				return;
			}

			if (x72 && x72 === x41.current) {
				return;
			}

			x43.current = false;
			x29(true);

			try {
				x61();
				closeConnSocket(x59, SWITCHED_ITEM_CODE, x44('4001'));
				x21(x70);
				const x73 = await x53(x70, x71);

				if (x73) {
					const { sessionKey: x74 } = x73;
					x23(x74);
					x41.current = x74;
				}

				const x75 = x42.current || x71?.query || x71?.categoryKey;
				const x76 = !!(x75 && x73);

				if (x76) {
					x21(x73.session);
				}
			} finally {
				x29(false);
			}
		},
		[x53, x44, x0, x61, x59],
	);

	const x77 = useCallback(
		async (x78: string) => {
			await x54(x78);
			x21(x78);
			x43.current = false;
		},
		[x54],
	);

	useEffect(() => {
		const x79 = x0 ? null : (window.history.state as { itemKey?: string });
		const x80 = x79?.itemKey || null;

		if (x13) {
			x77(x13);
		} else if (x14) {
			x69(x14, null, x80);
		} else {
			x69();
		}
	}, [x13, x14, x77, x69, x0]);

	useEffect(() => {
		if (!x0) {
			x42.current = x15;
		}

		if (x0 && x31) {
			x69(null, x30);
		}
	}, [x30, x69, x0, x31, x15]);

	useEffect(() => {
		const x81 = () => {
			x43.current = true;
		};

		window.addEventListener('beforeunload', x81);

		return () => {
			window.removeEventListener('beforeunload', x81);
		};
	}, []);

	return {
		x1: x24,
		x8: !x26 || x48,
		x3: x16,
		x4: x18,
		x7: x55,
		x5: x20,
		x6: x22,
		x2: x52?.readOnly || false,
		x9: x65,
		x10: x69,
		x11: x50,
	};
}
