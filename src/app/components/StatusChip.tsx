import type { DeviceStatus } from '../../data/devices'
import type { AlertSeverity } from '../../data/alerts'

type Status = DeviceStatus | AlertSeverity | 'good' | 'attention' | 'service' | 'preview'

export function StatusChip({ status, label }: { status: Status; label?: string }) {
  return <span className="status-chip" data-status={status}><i aria-hidden="true" />{label ?? status}</span>
}
