// SkillBadge.swift
import SwiftUI

struct SkillBadge: View {
    let skill: Skill

    var body: some View {
        HStack(spacing: Spacing.sm) {
            Image(systemName: skill.symbol)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(AppTheme.Accent.primary)
            Text(skill.name)
                .font(Typography.callout)
                .foregroundStyle(.primary)

            // Proficiency dots
            HStack(spacing: 3) {
                ForEach(0..<5, id: \.self) { i in
                    Circle()
                        .fill(Double(i) < skill.proficiency * 5
                              ? AppTheme.Accent.primary
                              : .white.opacity(0.15))
                        .frame(width: 5, height: 5)
                }
            }
        }
        .padding(.horizontal, Spacing.md)
        .padding(.vertical, Spacing.sm)
        .background(.ultraThinMaterial, in: Capsule())
        .overlay(Capsule().strokeBorder(.white.opacity(0.08), lineWidth: 1))
        .hoverEffect(.highlight)
    }
}

#Preview("SkillBadge") {
    HStack { SkillBadge(skill: MockData.skills[0]); SkillBadge(skill: MockData.skills[1]) }
        .padding()
}
