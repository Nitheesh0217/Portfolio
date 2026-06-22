// RecruiterScene.swift
// Curated single-window view for recruiters / hiring managers.
// Auto-opens timeline + certificates alongside this window.

import SwiftUI

struct RecruiterScene: View {
    @Environment(PortfolioViewModel.self) private var portfolio
    @Environment(\.openWindow) private var openWindow

    var body: some View {
        ScrollView {
            VStack(spacing: Spacing.xl) {

                // Hero card
                GlassCard(material: AppTheme.GlassMaterial.panel, cornerRadius: AppTheme.Radius.xl) {
                    HStack(alignment: .top, spacing: Spacing.xl) {
                        VStack(alignment: .leading, spacing: Spacing.md) {
                            Text(PortfolioContent.fullName).font(Typography.title1)
                            Text(PortfolioContent.title).font(Typography.bodyLarge).foregroundStyle(.secondary)
                            HStack(spacing: Spacing.md) {
                                badge("Open to work", systemImage: "circle.fill", tint: AppTheme.Accent.success)
                                badge(PortfolioContent.location, systemImage: "location.fill", tint: .secondary)
                                badge("STEM OPT", systemImage: "checkmark.seal.fill", tint: AppTheme.Accent.primary)
                            }
                            Text(PortfolioContent.tagline).font(Typography.body)
                        }
                        Spacer()
                        if let resume = PortfolioContent.resume {
                            Link(destination: resume) {
                                Label("Download Resume", systemImage: "arrow.down.doc.fill")
                                    .padding(.horizontal, Spacing.lg).padding(.vertical, Spacing.md)
                                    .background(AppTheme.Accent.primary, in: Capsule())
                                    .foregroundStyle(.white)
                            }
                            .hoverEffect(.lift)
                        }
                    }
                }

                // Quick links
                HStack(spacing: Spacing.md) {
                    quickLink(title: "Timeline",      symbol: "calendar")          { openWindow(id: "timeline") }
                    quickLink(title: "Certificates",  symbol: "checkmark.seal")    { openWindow(id: "certificates") }
                    quickLink(title: "Projects",      symbol: "square.grid.2x2")   { openWindow(id: "projects") }
                    quickLink(title: "AI Chat",       symbol: "bubble.left.and.bubble.right") { openWindow(id: "ai-assistant") }
                }

                // Highlights
                GlassCard {
                    VStack(alignment: .leading, spacing: Spacing.md) {
                        Text("Recent highlights").font(Typography.title3)
                        Divider().opacity(0.3)
                        ForEach(highlights, id: \.self) { line in
                            HStack(alignment: .top, spacing: Spacing.sm) {
                                Image(systemName: "sparkle").foregroundStyle(AppTheme.Accent.primary)
                                Text(line).font(Typography.body)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .padding(Spacing.xl)
        }
        .background(AppTheme.GlassMaterial.panel)
        .onAppear {
            // Auto-arrange — open timeline + certificates beside this window.
            openWindow(id: "timeline")
            openWindow(id: "certificates")
        }
    }

    private let highlights = [
        "40% query performance gain on Snowflake/Redshift ETL (CXC Solutions, 2024).",
        "68% lookup-time reduction across 45 engineers via Citrix RAG knowledge base.",
        "28% human-escalation reduction via Kore.ai NLU bot retraining.",
        "Two production full-stack apps deployed (Coach Jake, Scent House).",
    ]

    @ViewBuilder
    private func badge(_ text: String, systemImage: String, tint: Color) -> some View {
        HStack(spacing: 6) {
            Image(systemName: systemImage).foregroundStyle(tint)
            Text(text).font(Typography.caption)
        }
        .padding(.horizontal, Spacing.sm).padding(.vertical, 6)
        .background(.regularMaterial, in: Capsule())
    }

    @ViewBuilder
    private func quickLink(title: String, symbol: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: Spacing.xs) {
                Image(systemName: symbol).font(.system(size: 22))
                Text(title).font(Typography.callout)
            }
            .padding(.vertical, Spacing.md)
            .frame(maxWidth: .infinity)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: AppTheme.Radius.md))
        }
        .buttonStyle(.plain)
        .hoverEffect(.lift)
    }
}

#Preview("Recruiter") {
    RecruiterScene().environment(PortfolioViewModel()).frame(width: 1200, height: 820)
}
