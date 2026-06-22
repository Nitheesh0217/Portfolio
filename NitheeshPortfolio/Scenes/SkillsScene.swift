// SkillsScene.swift
// Flat skills overview. The IMMERSIVE version is in ImmersiveSpaceScene.swift —
// this scene's CTA opens that immersive space.

import SwiftUI

struct SkillsScene: View {
    @Environment(PortfolioViewModel.self) private var portfolio
    @Environment(\.openImmersiveSpace) private var openImmersive
    @Environment(\.dismissImmersiveSpace) private var dismissImmersive

    var body: some View {
        VStack(spacing: 0) {
            SpatialNavBar(title: "Skills", subtitle: "Grouped by category") {
                Button {
                    Task {
                        if portfolio.isImmersiveSpaceOpen {
                            await dismissImmersive()
                            portfolio.isImmersiveSpaceOpen = false
                        } else {
                            _ = await openImmersive(id: "skills-immersive")
                            portfolio.isImmersiveSpaceOpen = true
                        }
                    }
                } label: {
                    Label(portfolio.isImmersiveSpaceOpen ? "Exit Immersive" : "Enter Immersive",
                          systemImage: "sparkles")
                        .padding(.horizontal, Spacing.md)
                        .padding(.vertical, Spacing.xs)
                        .background(AppTheme.Accent.primary.opacity(0.2), in: Capsule())
                }
                .hoverEffect(.lift)
            }

            ScrollView {
                VStack(alignment: .leading, spacing: Spacing.xl) {
                    ForEach(Skill.Category.allCases) { category in
                        VStack(alignment: .leading, spacing: Spacing.md) {
                            Text(category.title.uppercased())
                                .font(Typography.caption)
                                .foregroundStyle(.secondary)
                                .tracking(2)

                            FlowLayout(spacing: Spacing.sm) {
                                ForEach(portfolio.skills(in: category)) { skill in
                                    SkillBadge(skill: skill)
                                }
                            }
                        }
                    }
                }
                .padding(Spacing.xl)
            }
        }
        .background(AppTheme.GlassMaterial.panel)
    }
}

// Simple flow layout for badges (avoids LazyVGrid for variable-width pills).
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxW = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowH: CGFloat = 0
        for sv in subviews {
            let s = sv.sizeThatFits(.unspecified)
            if x + s.width > maxW { x = 0; y += rowH + spacing; rowH = 0 }
            x += s.width + spacing
            rowH = max(rowH, s.height)
        }
        return CGSize(width: maxW, height: y + rowH)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowH: CGFloat = 0
        for sv in subviews {
            let s = sv.sizeThatFits(.unspecified)
            if x + s.width > bounds.maxX { x = bounds.minX; y += rowH + spacing; rowH = 0 }
            sv.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(s))
            x += s.width + spacing
            rowH = max(rowH, s.height)
        }
    }
}

#Preview("Skills") {
    SkillsScene().environment(PortfolioViewModel()).frame(width: 900, height: 700)
}
