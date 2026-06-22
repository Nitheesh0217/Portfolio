// TimelineScene.swift
import SwiftUI

struct TimelineScene: View {
    @Environment(PortfolioViewModel.self) private var portfolio

    var body: some View {
        VStack(spacing: 0) {
            SpatialNavBar(title: "Timeline", subtitle: "Education & experience")

            ScrollView {
                LazyVStack(alignment: .leading, spacing: Spacing.md) {
                    ForEach(portfolio.experiences.sorted(by: { $0.start > $1.start })) { exp in
                        TimelineRow(experience: exp)
                    }
                }
                .padding(.horizontal, Spacing.xl)
                .padding(.bottom, Spacing.xxl)
            }
        }
        .background(AppTheme.GlassMaterial.panel)
    }
}

#Preview("Timeline") {
    TimelineScene().environment(PortfolioViewModel()).frame(width: 900, height: 1100)
}
