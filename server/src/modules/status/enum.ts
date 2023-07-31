export enum ComponentStatus {
  // 应用程序恢复正常运行
  Operational = 'operational',
  // 应用程序正在进行维护
  UnderMaintenance = 'under_maintenance',
  // 应用程序组件性能降低
  DegradedPerformance = 'degraded_performance',
  // 应用程序组件部分宕机
  PartialOutage = 'partial_outage',
  // 应用程序组件完全宕机
  MajorOutage = 'major_outage',
}
