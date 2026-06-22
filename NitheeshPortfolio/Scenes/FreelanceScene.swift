// FreelanceScene.swift
// Client-facing pricing & engagement options.

import SwiftUI

struct FreelanceScene: View {
    var body: some View {
        VStack(spacing: 0) {
            SpatialNavBar(title: "Freelance", subtitle: "Engagement options")

            ScrollView {
                VStack(spacing: Spacing.lg) {
                    rateCard(
                        tier: "Discovery Call",
                        price: "Free",
                        bullets: ["30-min scoping", "Stack & timeline rec", "No-strings quote"],
                        cta: "Book Call",
                        primary: false
                    )
                    rateCard(
                        tier: "Project Build",
                        price: "$4–12k",
                        bullets: [
                            "Full-stack web/mobile app",
                            "Supabase + Next.js + payments",
                            "2–6 week delivery",
                            "30-day post-launch support",
                        ],
                        cta: "Start Project",
                        primary: true
                    )
                    rateCard(
                        tier: "Retainer",
                        price: "$3k/mo",
                        bullets: [
                            "10 hrs/week dedicated",
                            "Async-first, async-friendly hours",
                            "Slack + Linear access",
                        ],
                        cta: "Contact",
                        primary: false
                    )
                }
                .padding(Spacing.xl)
            }
        }
        .background(AppTheme.GlassMaterial.panel)
    }

    @ViewBuilder
    private func rateCard(tier: String, price: String, bullets: [String], cta: String, primary: Bool) -> some View {
        GlassCard(
            material: primary ? AppTheme.GlassMaterial.panel : AppTheme.GlassMaterial.card,
            cornerRadius: AppTheme.Radius.xl
        ) {
            HStack(alignment: .top, spacing: Spacing.lg) {
                VStack(alignment: .leading, spacing: Spacing.md) {
                    Text(tier).font(Typography.title2)
                    Text(price).font(Typography.title1)
                        .foregroundStyle(primary ? AppTheme.Accent.primary : .primary)
                    ForEach(bullets, id: \.self) { b in
                        Label(b, systemImage: "checkmark").font(Typography.body)
                    }
                }
                Spacer()
                Link(destination: URL(string: "mailto:\(PortfolioContent.email)")!) {
                    Text(cta).font(Typography.callout)
                        .padding(.horizontal, Spacing.lg).padding(.vertical, Spacing.md)
                        .background(
                            primary ? AnyShapeStyle(AppTheme.Accent.primary) : AnyShapeStyle(.regularMaterial),
                            in: Capsule()
                        )
                        .foregroundStyle(primary ? .white : .primary)
                }
                .hoverEffect(.lift)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

#Preview("Freelance") {
    FreelanceScene().frame(width: 900, height: 720)
}
