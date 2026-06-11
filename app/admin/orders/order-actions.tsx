'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { markOrderAsPaid, markOrderAsDelivered } from '@/lib/actions/order.actions';

const AdminOrderActions = ({
  orderId,
  isPaid,
  isDelivered,
}: {
  orderId: string;
  isPaid: boolean;
  isDelivered: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-1">
      {!isPaid && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await markOrderAsPaid(orderId);
              router.refresh();
            })
          }
        >
          Mark Paid
        </Button>
      )}
      {isPaid && !isDelivered && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-7"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await markOrderAsDelivered(orderId);
              router.refresh();
            })
          }
        >
          Mark Delivered
        </Button>
      )}
    </div>
  );
};

export default AdminOrderActions;
