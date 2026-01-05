interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

const statusStyles = {
  pending: 'status-pending',
  accepted: 'status-accepted',
  rejected: 'status-rejected',
  expired: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  expired: 'Expired',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={statusStyles[status]}>
      {statusLabels[status]}
    </span>
  );
}
