// OrnamentToolbar.swift
// Persistent navigation ornament attached to the root window.
// Attach via `.ornament(attachmentAnchor:contentAlignment:)` on a Scene's content view.

import SwiftUI

struct OrnamentToolbar: View {

    @Environment(\.openWindow) private var openWindow
    @Environment(\.openImmersiveSpace) private var openImmersive
    @Environment(\.dismissImmersiveSpace) private var dismissImmersive
    @Environment(PortfolioViewModel.self) private var portfolio

    @State private var showSearch = false
    @State private var showPersona = false

    var body: some View {
        HStack(spacing: Spacing.xs) {
            navButton(symbol: "house.fill",   label: "Home")     { openWindow(id: "welcome") }
            navButton(symbol: "square.grid.2x2.fill", label: "Projects") { openWindow(id: "projects") }
            navButton(symbol: "sparkles",     label: "Skills") {
                Task {
                    if portfolio.isImmersiveSpaceOpen {
                        await dismissImmersive()
                        portfolio.isImmersiveSpaceOpen = false
                    } else {
                        _ = await openImmersive(id: "skills-immersive")
                        portfolio.isImmersiveSpaceOpen = true
                    }
                }
            }
            navButton(symbol: "calendar",     label: "Timeline") { openWindow(id: "timeline") }
            navButton(symbol: "bubble.left.and.bubble.right.fill", label: "AI") { openWindow(id: "ai-assistant") }
            navButton(symbol: "magnifyingglass", label: "Search") { showSearch.toggle() }

            Divider().frame(height: 28).padding(.horizontal, Spacing.xs)

            // Persona switcher
            Button {
                showPersona.toggle()
            } label: {
                HStack(spacing: Spacing.xs) {
                    Image(systemName: portfolio.persona.symbol)
                    Text(portfolio.persona.label).font(Typography.callout)
                }
                .padding(.horizontal, Spacing.md)
                .padding(.vertical, Spacing.xs)
                .background(.regularMaterial, in: Capsule())
            }
            .buttonStyle(.plain)
            .hoverEffect(.highlight)
            .popover(isPresented: $showPersona) {
                PersonaSwitcher()
                    .environment(portfolio)
                    .frame(minWidth: 280)
                    .padding(Spacing.md)
            }
        }
        .padding(Spacing.sm)
        .background(AppTheme.GlassMaterial.chrome, in: Capsule())
        .overlay(Capsule().strokeBorder(.white.opacity(0.08), lineWidth: 1))
        .popover(isPresented: $showSearch) {
            SearchScene()
                .environment(portfolio)
                .frame(minWidth: 540, minHeight: 480)
        }
    }

    @ViewBuilder
    private func navButton(symbol: String, label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 2) {
                Image(systemName: symbol).font(.system(size: 18, weight: .semibold))
                Text(label).font(Typography.caption)
            }
            .frame(width: 64, height: 56)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .hoverEffect(.lift)
    }
}
