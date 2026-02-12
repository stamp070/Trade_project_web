import React, { useState } from 'react';

interface BotVersion {
    id: string;
    label: string;
}

interface MT5Account {
    id: string;
    label: string;
}

interface BotsModalProps {
    isOpen: boolean;
    onClose: () => void;
    versions: BotVersion[];
    accounts: MT5Account[];
    onConfirm: (versionId: string, accountId: string) => void;
}

export const BotsModal: React.FC<BotsModalProps> = ({
    isOpen,
    onClose,
    versions,
    accounts,
    onConfirm,
}) => {
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [selectedAccount, setSelectedAccount] = useState<string>('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedVersion && selectedAccount) {
            onConfirm(selectedVersion, selectedAccount);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Configure Bot Deployment</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Bot Version</label>
                        <select
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            value={selectedVersion}
                            onChange={(e) => setSelectedVersion(e.target.value)}
                        >
                            <option value="">Choose a version...</option>
                            {versions.map((v) => (
                                <option key={v.id} value={v.id}>{v.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Select MT5 Account</label>
                        <select
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                        >
                            <option value="">Choose an account...</option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>{a.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedVersion || !selectedAccount}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
