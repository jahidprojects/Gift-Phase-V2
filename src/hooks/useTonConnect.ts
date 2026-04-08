import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();

  return {
    sender: {
      send: async (args: any) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: !!walletAddress,
    walletAddress,
    network: tonConnectUI.account?.chain ?? null,
    tonConnectUI,
  };
}
