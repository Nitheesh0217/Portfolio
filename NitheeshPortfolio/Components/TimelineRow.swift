// TimelineRow.swift
import SwiftUI

struct TimelineRow: View {
    let experience: Experience

    private static let formatter: DateFormatter = {
        let f = DateFormatter(); f.dateFormat = "MMM yyyy"; return f
    }()

    var dateRange: String {
        let start = Self.formatter.string(from: experience.start)
        let end   = experience.end.map { Self.formatter.string(from: $0) } ?? "Present"
        return "\(start) — \(end)"
    }

    var body: some View {
        HStack(alignment: .top, spacing: Spacing.lg) {
            // Timeline dot + line
            VStack(spacing: 0) {
                Circle()
                    .fill(experience.isCurrent ? AppTheme.Accent.success : AppTheme.Accent.primary)
                    .frame(width: 14, height: 14)
                    .overlay(Circle().strokeBorder(.white.opacity(0.2), lineWidth: 2))
                Rectangle()
                    .fill(.white.opacity(0.12))
                    .frame(width: 2)
                    .frame(maxHeight: .infinity)
            }
            .frame(width: 14)

            GlassCard {
                VStack(alignment: .leading, spacing: Spacing.xs) {
                    HStack {
                        Text(experience.role)
                            .font(Typography.title3)
                        Spacer()
                        Text(dateRange)
                            .font(Typography.caption)
                            .foregroundStyle(.secondary)
                    }
                    Text("\(experience.organization) · \(experience.location)")
                        .font(Typography.callout)
                        .foregroundStyle(.secondary)
                    Divider().padding(.vertical, Spacing.xxs).opacity(0.3)
                    ForEach(experience.bullets, id: \.self) { b in
                        HStack(alignment: .top, spacing: Spacing.xs) {
                            Image(systemName: "circle.fill")
                                .font(.system(size: 4))
                                .foregroundStyle(.tertiary)
                                .padding(.top, 7)
                            Text(b).font(Typography.body).foregroundStyle(.primary)
                        }
                    }
                }
            }
        }
    }
}

#Preview("TimelineRow") {
    TimelineRow(experience: MockData.experiences[0])
        .padding()
}
